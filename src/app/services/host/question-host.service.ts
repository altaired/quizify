import { Injectable } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { Observable, combineLatest, of, merge, interval, timer, BehaviorSubject, Subject } from 'rxjs';
import { switchMap, map, filter, take, delay, tap, takeWhile, share, takeUntil } from 'rxjs/operators';
import { maxBy, has } from 'lodash';
import { HistoryHostService } from './history-host.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { PlaybackService } from '../playback.service';
import { Player, Game, GameState } from 'src/app/models/state';
import { StateHostService } from './state-host.service';

export const QUESTION_MAX_TIMER = 120;

@Injectable({
  providedIn: 'root'
})
export class QuestionHostService {

  complete$ = new Subject<string>();

  track$ = new BehaviorSubject<any>(null);
  timer$ = new BehaviorSubject<Observable<number>>(null);
  result$ = new BehaviorSubject<any[]>(null);

  TRACK_POPULARITY_THRESHOLD = 75;


  constructor(
    private spotify: SpotifyService,
    private history: HistoryHostService,
    private db: AngularFireDatabase,
    private playback: PlaybackService,
    private state: StateHostService
  ) { }

  start(category: string) {

    this.spotify.getCategoryPlaylists(category)
      .pipe(
        takeUntil(this.complete$),
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
            const newTracks: any[] = tracks.filter(t => this.history.validateTrack(t.track.id));
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
        this.history.addTrack(t.track.id);
        this.sendQuestion(t, options);
      });
  }

  private sendQuestion(t: any, options: any[]) {
    this.track$.next(t);
    const code = this.state.code$.getValue();
    console.log('[GameHost] Received track', t.track);
    this.db.object('games/' + code + '/playerDisplay/question').set({
      id: t.track.id,
      first: {
        title: 'Name the artist',
        options: options.map(option => {
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
    this.state.changeState('ANSWER');
    let started = false;
    this.playback.play(t.track.uri).pipe(
      switchMap(response => interval(1000)),
      switchMap(trigger => this.playback.state()),
      takeWhile(() => !started),
      takeUntil(this.complete$),
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
      take(1),
      delay(2500),
      switchMap(() => combineLatest(this.state.players$, this.track$)),
      switchMap(([players, track]) => {
        return combineLatest(
          of(players),
          of(track),
          this.searchValidator(
            players.filter(p => has(p.response, 'second')).map(p => p.response.second),
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
      this.clear();
      this.complete();
    });

    end.pipe(
      take(1),
      takeUntil(this.complete$),
      tap(() => console.log('[GameHost] Times up or all done'))
    ).subscribe(() => {
      this.state.changeState('RESULT');
    });
  }

  searchValidator(q: string[], track: string): Observable<string[]> {
    return combineLatest(
      q.map(query => combineLatest(of(query), this.spotify.searchTrack(query)))
    ).pipe(
      takeUntil(this.complete$),
      map(res => {
        const filtered = res.filter(pq => {
          const trackResult: any[] = pq[1].tracks.items;
          return trackResult.some(t => t.id === track);
        });
        return filtered.map(f => f[0]);
      })
    );
  }

  clear() {
    this.state.code$.pipe(take(1)).subscribe(code => {
      this.db.object(`games/${code}/playerDisplay`).remove();
      this.db.list('games/' + code + '/players').snapshotChanges()
        .subscribe(res => {
          res.forEach(player => {
            this.db.object(`games/${code}/players/${player.key}/response`).remove();
          });
        });
    });
  }

  get allPlayersDone(): Observable<Player[]> {
    return combineLatest(this.track$, this.state.players$).pipe(
      filter(([track, players]) => players.every(p => {
        if (p.response ? true : false) {
          if (p.response.done && p.response.question === track.track.id) {
            console.log('[GameHost] Player responded');
            return true;
          }
        }
        return false;
      })),
    );
  }

  get timesUP(): Observable<number> {
    return this.timer$.pipe(
      switchMap(t => t),
      filter(time => time === QUESTION_MAX_TIMER)
    );
  }

  private complete() {
    timer(1000, 1000).pipe(
      takeWhile(n => n < 15),
      filter(n => n === 14)
    ).subscribe(() => this.complete$.next(''));
  }
}

export interface PlayerResult {
  id: string;
  first: Boolean;
  second: Boolean;
}
