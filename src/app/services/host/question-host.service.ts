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
  artists$ = new BehaviorSubject<any[]>(null);
  timer$ = new BehaviorSubject<Observable<number>>(null);
  result$ = new BehaviorSubject<any[]>(null);

  TRACK_POPULARITY_THRESHOLD = 50;


  constructor(
    private spotify: SpotifyService,
    private history: HistoryHostService,
    private db: AngularFireDatabase,
    private playback: PlaybackService,
    private state: StateHostService
  ) { }

  start(category: string) {
    this.log('Starting question...');

    this.spotify.getCategoryPlaylists(category)
      .pipe(
        takeUntil(this.complete$),
        switchMap(res => this.pickRandomPlaylist(res)),
        map(res => this.pickRandomTrack(res)),
        filter(track => track ? true : false),
        switchMap(t =>
          combineLatest(of(t), this.spotify.getRelatedArtists(t.track.artists[0].id), this.spotify.getArtist(t.track.artists[0].id))
        ),
        take(1)
      ).subscribe(([track, relatedArtists, selectedTrackArtist]) => {
        const options = relatedArtists.artists.filter(relatedArtist =>
          track.track.artists.every(trackArtist => relatedArtist.id !== trackArtist.id)
        ).slice(0, 3);
        options.push(selectedTrackArtist);
        this.history.addTrack(track.track.id);
        this.distribute(track, options);
      });
  }

  private pickRandomPlaylist(playlistsResponse: any): Observable<any> {
    const playlists: any[] = playlistsResponse.playlists.items;
    // const playlist = playlists[Math.floor(Math.random() * playlists.length)];
    const playlist = playlists[0];
    this.log('Picked a random playlist ' + playlist.id);
    return this.spotify.getPlaylitsTracks(playlist.id);
  }

  private pickRandomTrack(playlist: any) {
    if (playlist.items) {
      const tracks: any[] = playlist.items;
      const newTracks: any[] = tracks.filter(t => this.history.validateTrack(t.track.id));
      const allowedTracks = newTracks.filter(t => t.track.popularity >= this.TRACK_POPULARITY_THRESHOLD);
      if (allowedTracks.length > 0) {
        // Get a random track within the populatity threshold
        const selectedTrack = allowedTracks[Math.floor(Math.random() * allowedTracks.length)];
        this.log(`Picked a track (Rand L${allowedTracks.length}) ${selectedTrack.track.name}`);
        return selectedTrack;
      } else {
        // No tracks fullfilled the threshold, get the most popular one
        const selectedTrack = maxBy(tracks, t => t.track.popularity);
        this.log('Picked a track (HighP) ' + selectedTrack.track.name);
        return selectedTrack;
      }
    } else {
      this.log('Could not fetch tracks');
      return null;
    }
  }

  private distribute(t: any, options: any[]) {
    this.track$.next(t);
    this.artists$.next(options);
    this.state.code$.pipe(take(1)).subscribe(code => {
      this.log('Track received' + t.track.name);
      this.db.object('games/' + code + '/playerDisplay/question').set({
        id: t.track.id,
        first: {
          title: 'Name the artist',
          options: options.map(option => {
            return { id: option.id, image: option.images[0], value: option.name };
          })
        },
        secondEnabled: true,
        second: 'Name the track'
      });
      this.state.changeState('ANSWER');
      this.play(t.track.uri);
    });
  }

  private play(uri: string) {
    let started = false;
    this.playback.play(uri).pipe(
      switchMap(response => interval(1000)),
      switchMap(trigger => this.playback.state()),
      takeWhile(() => !started),
      takeUntil(this.complete$),
      tap((state: any) => {
        if (state.is_playing) {
          this.log('Track is playing');
          started = true;
          this.timer$.next(this.questionTimer);
          this.log('Timer started');
          this.observe();
        } else {
          this.log('Waiting for track to play...');
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

  private observe() {
    this.log('Activated response observation');

    this.end.subscribe(([players, track, artists, queries]) => {
      this.log('Checking all responses...');
      this.result$.next(players.map(player => {
        if (has(player, 'response')) {
          const response = player.response;
          const result: PlayerResult = {
            id: player.uid,
            first: false,
            firstValue: '',
            second: false,
            secondValue: '',
          };
          if (response.done) {
            if (has(response, 'first')) {
              const artist = artists.find(a => a.id === response.first);
              result.firstValue = artist ? artist.name : '';
            }
            result.secondValue = has(response, 'second') ? response.second : '';
            if (response.first === track.track.artists[0].id) {
              result.first = true;
            }
            if (queries.find(q => q === response.second)) {
              result.second = true;
            }
          }
          return result;
        } else {
          const result: PlayerResult = {
            id: player.uid,
            first: false,
            firstValue: '',
            second: false,
            secondValue: ''
          };
          return result;
        }

      }));
      this.log('Results complete');
      this.clear();
      this.complete();
    });
  }

  private get end() {
    return merge(this.allPlayersDone, this.timesUP).pipe(
      takeUntil(this.complete$),
      take(1),
      tap(() => this.log('Game ended (times up or all players responded)')),
      tap(() => this.state.changeState('RESULT')),
      delay(2500),
      switchMap(() => combineLatest(
        this.state.players$,
        this.track$,
        this.artists$
      ).pipe(take(1))
      ),
      switchMap(([players, track, artists]) => {
        return combineLatest(
          of(players),
          of(track),
          of(artists),
          this.autocomplete(
            players.filter(p => has(p.response, 'second')).map(p => p.response.second),
            track.track.id
          )
        ).pipe(take(1));
      }),
      tap(() => this.log('Autocompleted track responses ready for validation')),
    );
  }

  private autocomplete(q: string[], track: string): Observable<string[]> {
    this.log('Autocompleting track responses...');
    const filtered = q.filter(st => st !== '');
    if (filtered.length > 0) {
      return combineLatest(
        filtered.map(query => combineLatest(of(query), this.spotify.searchTrack(query)))
      ).pipe(
        takeUntil(this.complete$),
        map(res => {
          const filteredResult = res.filter(pq => {
            const trackResult: any[] = pq[1].tracks.items;
            return trackResult.some(t => t.id === track);
          });
          return filteredResult.map(f => f[0]);
        }),
        tap(() => this.log('Autocompletion of track responses completed'))
      );
    } else {
      this.log('No tracks checked');
      return of([]);
    }

  }

  private clear() {
    this.log('Clearing response data...');
    this.state.code$.pipe(take(1)).subscribe(code => {
      this.db.object(`games/${code}/playerDisplay`).remove();
      this.db.list('games/' + code + '/players').snapshotChanges().pipe(take(1))
        .subscribe(res => {
          Promise.all(res.map(player => {
            this.db.object(`games/${code}/players/${player.key}/response`).remove();
          })).then(() => this.log('Response data cleared'));
        });
    });
  }

  private get allPlayersDone(): Observable<Player[]> {
    return combineLatest(this.track$, this.state.players$).pipe(
      filter(([track, players]) => players.every(p => {
        if (p.response ? true : false) {
          if (p.response.done && p.response.question === track.track.id) {
            return true;
          }
        }
        return false;
      }),
        tap(() => this.log('All players reponded'))
      ),
    );
  }

  private get timesUP(): Observable<number> {
    return this.timer$.pipe(
      switchMap(t => t),
      filter(time => time === QUESTION_MAX_TIMER),
      tap(() => this.log('Times up'))
    );
  }

  private complete() {
    const resultTime = 25;
    this.log('Starting result timer for ' + resultTime + ' seconds');
    timer(1000, 1000).pipe(
      takeWhile(n => n < resultTime),
      filter(n => n === resultTime - 1)
    ).subscribe(() => this.complete$.next(''));
  }

  /**
   * Logs to the console, prepending a file specific prefix
   * @param msg The message to log
   */
  private log(msg: string) {
    console.log('[Host][Question] ' + msg);
  }
}

export interface PlayerResult {
  id: string;
  first: Boolean;
  firstValue: string;
  second: Boolean;
  secondValue: string;
}
