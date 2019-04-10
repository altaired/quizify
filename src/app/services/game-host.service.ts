import { Injectable } from '@angular/core';
import { Game, GameMode, Player, GameState, Option, CategoryState } from '../models/state';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable, combineLatest, of, timer, interval, merge } from 'rxjs';
import { map, switchMap, filter, takeUntil, share, take, takeWhile, tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Hash } from 'src/app/utils/hash';
import { AuthService } from './auth.service';
import { PlaybackService } from './playback.service';
import { History } from '../models/history';
import { SpotifyService } from './spotify.service';
import { maxBy } from 'lodash';
import { CATEGORY_WHITELIST } from '../utils/whitelist';
import { resolveTimingValue } from '@angular/animations/browser/src/util';

/**
 * Takes care of the hosts state which is
 * observed by the players.
 */

export const QUESTION_MAX_TIMER = 120;

@Injectable({
  providedIn: 'root'
})
export class GameHostService {
  TRACK_POPULARITY_THRESHOLD = 75;

  private hasher = new Hash('QUIZIFY', 6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789');

  gameCode$ = new BehaviorSubject<string>(null);
  category$ = new BehaviorSubject<string>(null);
  track$ = new BehaviorSubject<any>(null);
  timer$ = new BehaviorSubject<Observable<number>>(null);
  result$ = new BehaviorSubject<any[]>(null);
  state$: Observable<Game>;
  private history: History;

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService,
    private spotify: SpotifyService,
    private playback: PlaybackService,
    private router: Router
  ) {
    this.history = {
      tracks: [],
      categories: [],
      pickers: [],
      introduced: false,
      games: 0
    };
  }

  private get hash(): Observable<string> {
    return this.auth.user$.pipe(
      take(1),
      map(user => {
        const dateHash = new Date().valueOf();
        return this.hasher.encode(dateHash);
      })
    );
  }

  newGame(gameMode: GameMode) {
    this.hash.pipe(take(1)).subscribe(gameCode => {
      console.log('[GameHost] Game code ' + gameCode);
      const game: Game = {
        gameMode: gameMode,
        state: 'WELCOME'
      };
      this.db.object('games/' + gameCode).set(game);
      this.gameCode$.next(gameCode);
      this.state$ = this.gameCode$
        .pipe(
          switchMap(code => this.db.object<Game>('games/' + code).valueChanges().pipe(share()))
        );
      this.startWelcome();
    });

  }

  get players$(): Observable<Player[]> {
    return this.state$.pipe(
      filter(state => state.players ? true : false),
      map(state => Object.values(state.players)),
    );
  }


  private startWelcome() {
    this.router.navigate(['display']);
    const subscription = this.state$.pipe(
      filter(state => state.players ? true : false),
      map(state => Object.values(state.players)),
    ).subscribe(players => {
      if (players.length === 1) {
        this.setGameAdmin(players[0].uid);
        subscription.unsubscribe();
      }
      console.log('[GameHost] Players', players);
    });
  }

  private setGameAdmin(uid: string) {
    this.gameCode$.subscribe(code => {
      this.db.object('games/' + code).update({
        admin: {
          playerUID: uid,
          ready: false
        }
      });
      console.log('[GameHost] Admin player updated to ' + uid);
      this.activateWelcomeObserver();
    });
  }

  private activateWelcomeObserver() {
    this.state$.pipe(
      takeUntil(this.state$.pipe(filter(state => state.state !== 'WELCOME'))),
      filter(state => state.admin ? true : false),
      map(state => state.admin.ready),
      filter(ready => ready),
    ).subscribe(ready => {
      console.log('[GameHost] Admin is ready');
      this.startGame();
    });
  }

  private startGame() {
    console.log('[GameHost] Starting game...');
    this.initPickCategory();
  }

  private initPickCategory() {
    this.history.games += 1;
    if (!this.history.introduced) {
      // Players not introduced yet
      this.startIntro();
    } else {
      combineLatest(this.spotify.listCategories().pipe(
        map(res => {
          const categories = res.categories.items;
          const allowed = categories.filter(c => CATEGORY_WHITELIST.some(id => c.id === id));
          const shuffled = allowed.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 6);
          return selected;
        })
      ), this.players$).pipe(take(1))
        .subscribe(([categories, players]) => {
          console.log('[GameHost] Initializing category picking...');
          this.startPickCategory(categories, players);
        });
    }
  }

  private startPickCategory(categories, players: Player[]) {
    const code = this.gameCode$.getValue();
    const options = categories.map(category => {
      const categoryObj: Option = {
        id: category.id,
        value: category.name,
        image: category.icons[0]
      };
      return categoryObj;
    });
    const selectedPlayer = players.find(player =>
      !this.history.pickers.some(picker => picker === player.uid)
    );
    const categoryState: CategoryState = {
      playerUID: selectedPlayer.uid,
      done: false,
      options: options
    };
    this.db.object('games/' + code + '/playerDisplay/category').set(categoryState);
    this.setState('PICK_CATEGORY');
    this.activateCategoryObserver();
    console.log('[GameHost] Waiting for player to pick a category');
  }


  private activateCategoryObserver() {
    const subscription = this.state$.pipe(
      map(state => state.playerDisplay.category)
    ).subscribe(categoryState => {
      if (categoryState.done) {
        // Player picked a category
        console.log('[GameHost] Player picked category: ' + categoryState.playerResponse);
        // Updates the history
        this.history.pickers.push(categoryState.playerUID);
        this.history.categories.push(categoryState.playerResponse);
        subscription.unsubscribe();
        this.category$.next(categoryState.playerResponse);
        this.initQuestion();

      } else {
        // Player have not picked a category yet
      }
    });
  }

  private initQuestion() {
    this.askQuestion();
  }

  private startIntro() {
    this.setState('INTRO');
  }

  introComplete() {
    this.history.introduced = true;
    this.initPickCategory();
  }

  private askQuestion() {
    const category = this.category$.getValue();
    this.spotify.getCategoryPlaylists(category)
      .pipe(
        switchMap(res => {
          // Pick a random playlist from the provided category
          const playlists: any[] = res.playlists.items;
          // const playlist = playlists[Math.floor(Math.random() * playlists.length)];
          const playlist = playlists[0];
          console.log('[GameHost] Picked a random playlist ' + playlist.id);
          return this.spotify.getPlaylitsTracks(playlist.id);
        }),
        map(res => {
          if (res.items) {
            const tracks: any[] = res.items;
            const newTracks: any[] = tracks.filter(t => this.history.tracks.every(ht => ht !== t.track.id));
            const allowedTracks = newTracks.filter(t => t.track.popularity >= this.TRACK_POPULARITY_THRESHOLD);
            if (allowedTracks.length > 0) {
              // Get a random track within the populatity threshold
              const selectedTrack = allowedTracks[Math.floor(Math.random() * allowedTracks.length)];
              console.log(`[GameHost] Picked a track (Rand L${allowedTracks.length}) ${selectedTrack.track.name}`);
              return selectedTrack;
            } else {
              // No tracks fullfilled the threshold, get the most popular one
              const selectedTrack = maxBy(tracks, t => t.track.popularity);
              console.log('[GameHost] Picked a track (HighP) ' + selectedTrack.track.name);
              return selectedTrack;
            }
          } else {
            console.log('[GameHost] Could not fetch tracks');
            return null;
          }
        }),
        filter(track => track ? true : false),
        switchMap(t => {
          return combineLatest(
            of(t),
            this.spotify.getRelatedArtists(t.track.artists[0].id),
            this.spotify.getArtist(t.track.artists[0].id)
          );
        }),
        take(1)
      ).subscribe(([t, relatedArtists, artist]) => {
        // Add the track to history
        const artists: any[] = relatedArtists.artists;
        const trackArtists: any[] = t.track.artists;
        const filteredArtists = artists.filter(rArtist => trackArtists.every(tArtist => rArtist.id !== tArtist.id));
        const options = filteredArtists.slice(0, 3);
        options.push(artist);
        this.history.tracks.push(t.track.id);
        this.sendQuestion(t, options);
      });
  }

  private sendQuestion(t: any, options: any[]) {
    this.track$.next(t);
    const code = this.gameCode$.getValue();
    console.log('[GameHost] Received track', t.track);
    this.db.object('games/' + code + '/playerDisplay/question').set({
      id: t.track.id,
      first: {
        title: 'Name the artist',
        options: options.map(option => {
          console.log(option);
          return {
            id: option.id,
            image: option.images[0],
            value: option.name
          };
        })
      },
      secondEnabled: true,
      second: 'Name the track'
    });
    this.setState('ANSWER');
    let started = false;
    this.playback.play(t.track.uri).pipe(
      switchMap(response => interval(1000)),
      switchMap(trigger => this.playback.state()),
      takeWhile(() => !started),
      tap((state: any) => {
        if (state.is_playing) {
          console.log('[GameHost] Track is playing');
          started = true;
          this.timer$.next(this.questionTimer);
          this.activateQuestionObserver();
        } else {
          console.log('[GameHost] Waiting for track to play...');
        }
      }),
    ).subscribe();

  }

  private get questionTimer(): Observable<number> {
    return timer(1000, 1000).pipe(
      takeWhile(time => time <= QUESTION_MAX_TIMER),
      share()
    );
  }

  private activateQuestionObserver() {
    console.log('[GameHost] Activating response observation');

    const end = merge(this.allPlayersDone, this.timesUP);

    end.pipe(
      delay(2500),
      take(1),
      switchMap(() => combineLatest(this.players$, this.track$)),
      switchMap(([players, track]) => {
        return combineLatest(
          of(players),
          of(track),
          this.searchValidator(
            players.filter(p => p.response.second ? true : false).map(p => p.response.second),
            track.track.id
          )
        );
      })
    ).subscribe(([players, track, queries]) => {
      console.log('[GameHost] Checking answers...');

      this.result$.next(players.map(player => {
        const response = player.response;
        const result: PlayerResult = {
          id: player.uid,
          first: false,
          second: false
        };
        if (response.done) {
          if (response.first === track.track.artists[0].id) {
            result.first = true;
          }
          if (queries.find(q => q === response.second)) {
            result.second = true;
          }
        } else {
          console.log('[GameHost] Player did not finish in time ' + player.uid);
        }
        return result;
      }));
      console.log('[GameHost] Results calculated');
      this.nextSequence();
    });

    end.pipe(
      take(1),
      tap(() => console.log('[GameHost] Times up or all done')),
      switchMap(() => this.playback.pause())).subscribe(done => {
        this.setState('RESULT');
      });
  }

  searchValidator(q: string[], track: string): Observable<string[]> {
    return combineLatest(
      q.map(query => combineLatest(of(query), this.spotify.searchTrack(query)))
    ).pipe(
      map(res => {
        console.log(res);
        const filtered = res.filter(pq => {
          const trackResult: any[] = pq[1].tracks.items;
          return trackResult.some(t => t.id === track);
        });
        return filtered.map(f => f[0]);
      })
    );
  }

  get allPlayersDone(): Observable<Player[]> {
    return combineLatest(this.track$, this.players$).pipe(
      filter(([track, players]) => players.every(p => {
        if (p.response ? true : false) {
          if (p.response.done && p.response.question === track.track.id) {
            console.log('[GameHost] Player responded');
            return true;
          }
        }
        return false;
      })),
      take(1)
    );
  }

  get timesUP(): Observable<number> {
    return this.timer$.pipe(
      take(1),
      switchMap(t => t),
      filter(time => time === QUESTION_MAX_TIMER)
    );
  }

  private setState(state: GameState) {
    this.gameCode$.pipe(take(1)).subscribe(code => {
      this.db.object('games/' + code).update({ state: state });
    });
  }

  private nextSequence() {
    if (this.history.games < 4) {
      timer(1000, 1000).pipe(
        takeWhile(n => n < 15),
        filter(n => n === 14)
      ).subscribe(() => this.initPickCategory());
    }
  }

}

export interface PlayerResult {
  id: string;
  first: Boolean;
  second: Boolean;
}
