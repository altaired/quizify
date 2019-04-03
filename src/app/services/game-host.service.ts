import { Injectable } from '@angular/core';
import { Game, GameMode, Player, GameState, CategoryOption, CategoryState } from '../models/state';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, filter, takeUntil, share, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Hash } from 'src/app/utils/hash';
import { AuthService } from './auth.service';
import { History } from '../models/history';
import { SpotifyService } from './spotify.service';
import { maxBy } from 'lodash';

/**
 * Takes care of the hosts state which is
 * observed by the players.
 */

@Injectable({
  providedIn: 'root'
})
export class GameHostService {
  QUESTION_MAX_TIMER = 120;
  TRACK_POPULARITY_THRESHOLD = 60;

  private hasher = new Hash('QUIZIFY', 6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789');

  gameCode$ = new BehaviorSubject<string>(null);
  category$ = new BehaviorSubject<string>(null);
  state$: Observable<Game>;
  private history: History;

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService,
    private spotify: SpotifyService,
    private router: Router
  ) {
    this.history = {
      tracks: [],
      categories: [],
      pickers: [],
      introduced: false
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
      console.log('Game code', gameCode);
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
      console.log('Players', players);
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
      console.log('Admin set', uid);
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
      console.log('Admin is ready, starting game');
      this.startGame();
    });
  }

  private startGame() {
    combineLatest(this.spotify.listCategories().pipe(
      map(res => {
        const categories = res.categories.items;
        const shuffled = categories.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6);
        return selected;
      })
    ), this.players$).pipe(take(1)).subscribe(([categories, players]) => {
      this.initPickCategory(categories, players);
    });
  }

  private initPickCategory(categories, players: Player[]) {
    const code = this.gameCode$.getValue();
    const options = categories.map(category => {
      const categoryObj: CategoryOption = {
        id: category.id,
        name: category.name,
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
  }


  private activateCategoryObserver() {
    const csw = this.state$.pipe(map(state => state.state), filter(state => state !== 'PICK_CATEGORY'));
    this.state$.pipe(takeUntil(csw), map(state => state.playerDisplay.category))
      .subscribe(categoryState => {
        if (categoryState.done) {
          // Player picked a category
          console.log('Category picked', categoryState.playerResponse);

          // Updates the history
          this.history.pickers.push(categoryState.playerUID);
          this.history.categories.push(categoryState.playerResponse);
          this.category$.next(categoryState.playerResponse);
          this.initQuestion();
        } else {
          // Player have not picked a category yet
        }
      });
  }

  private initQuestion() {
    this.askQuestion();
    // if (!this.history.introduced) {
    //   // Players not introduced yet
    //   this.startIntro();
    // } else {
    //   this.askQuestion();
    // }

  }

  private startIntro() {
    this.setState('INTRO');
  }

  introComplete() {

  }

  private askQuestion() {
    const category = this.category$.getValue();
    this.spotify.getCategoryPlaylists(category)
      .pipe(
        switchMap(res => {
          // Pick a random playlist from the provided category
          const playlists: any[] = res.playlists.items;
          const playlist = playlists[Math.floor(Math.random() * playlists.length)];
          return this.spotify.getPlaylitsTracks(playlist.id);
        }),
        map(res => {
          const tracks: any[] = res.items;
          const newTracks: any[] = tracks.filter(t => this.history.tracks.every(ht => ht !== t.track.id));
          const allowedTracks = newTracks.filter(t => t.track.popularity >= this.TRACK_POPULARITY_THRESHOLD);
          if (allowedTracks.length > 0) {
            // Get a random track within the populatity threshold
            return allowedTracks[Math.floor(Math.random() * allowedTracks.length)];
          } else {
            // No tracks fullfilled the threshold, get the most popular one
            return maxBy(tracks, t => t.track.popularity);
          }
        }),
        take(1)
      ).subscribe(t => {
        // Add the track to history
        this.history.tracks.push(t.track.id);
        this.setQuestion(t.track);
      });
  }

  private setQuestion(track: any) {
    const code = this.gameCode$.getValue();
    this.db.object('games/' + code + '/playerDisplay/question')
  }

  private setState(state: GameState) {
    this.gameCode$.pipe(take(1)).subscribe(code => {
      this.db.object('games/' + code).update({ state: state });
    });
  }

}
