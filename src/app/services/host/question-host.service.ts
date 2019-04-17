import { Injectable } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import {
  Observable,
  combineLatest,
  of,
  merge,
  interval,
  timer,
  BehaviorSubject,
  Subject
} from 'rxjs';
import {
  switchMap,
  map,
  filter,
  take,
  delay,
  tap,
  takeWhile,
  share,
  takeUntil
} from 'rxjs/operators';
import { maxBy, has } from 'lodash';
import { HistoryHostService } from './history-host.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { PlaybackService } from '../playback.service';
import { Player } from 'src/app/models/state';
import { StateHostService } from './state-host.service';
import { ErrorSnackService } from '../error-snack.service';

/**
 * Service taking care of everything related to the questions beeing asked
 * @author Simon Persson, Oskar Norinder
 */

export const QUESTION_MAX_TIMER = 120;

@Injectable({
  providedIn: 'root'
})
export class QuestionHostService {

  complete$ = new Subject<string>();

  track$ = new BehaviorSubject<SAPI.PlaylistTrackObject>(null);
  artists$ = new BehaviorSubject<SAPI.ArtistObject[]>(null);
  timer$ = new BehaviorSubject<Observable<number>>(null);
  result$ = new BehaviorSubject<PlayerResult[]>(null);


  TRACK_POPULARITY_THRESHOLD = 50;


  constructor(
    private spotify: SpotifyService,
    private history: HistoryHostService,
    private db: AngularFireDatabase,
    private playback: PlaybackService,
    private state: StateHostService,
    private errorSnack: ErrorSnackService,
  ) { }


  /**
   * Starts the question screen by fetching a track based on a given category.
   * It then distributes the track to firebase and adds it to the history
   * @param category The category to find a track by
   */
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
        const options = relatedArtists.filter(relatedArtist =>
          track.track.artists.every(trackArtist => relatedArtist.id !== trackArtist.id)
        ).slice(0, 3);
        options.push(selectedTrackArtist);
        this.history.addTrack(track);
        this.distribute(track, options);
      });
  }

  /**
   * Picks a random playlist from a list of playlists
   * EDIT: Currently taking the first playlist, to make the game easier
   * @param playlistsResponse
   * @returns An `Observable` of the playlists tracks
   */
  private pickRandomPlaylist(playlistsResponse: SAPI.PagingObject<SAPI.PlaylistObject>):
    Observable<SAPI.PagingObject<SAPI.PlaylistTrackObject>> {
    const playlists: SAPI.PlaylistObject[] = playlistsResponse.items;
    // const playlist = playlists[Math.floor(Math.random() * playlists.length)];
    const playlist = playlists[0];
    this.log('Picked a random playlist ' + playlist.id);
    return this.spotify.getPlaylitsTracks(playlist.id);
  }


  /**
   * Picks a random track from a given playlist
   * @param playlist The playlist
   * @returns An `PlaylistTrackObject` with the random track
   */
  private pickRandomTrack(playlist: SAPI.PagingObject<SAPI.PlaylistTrackObject>): SAPI.PlaylistTrackObject {
    if (playlist.items) {
      const tracks: SAPI.PlaylistTrackObject[] = playlist.items;
      const newTracks: SAPI.PlaylistTrackObject[] = tracks.filter(t => this.history.validateTrack(t.track.id));
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

  /**
   * Sends the track and options to firebase in order to let the user guess.
   * When the data is sent the track is played and the state is changed
   * @param t The correct track
   * @param options The artist options provided to the user
   */
  private distribute(t: SAPI.PlaylistTrackObject, options: SAPI.ArtistObject[]) {
    this.track$.next(t);
    this.artists$.next(options);
    this.state.code$.pipe(take(1)).subscribe(code => {
      this.log('Track received ' + t.track.name);
      this.db.object('games/' + code + '/playerDisplay/question').set({
        id: t.track.id,
        first: {
          title: 'Name the artist',
          options: options.map(option => {
            // Checks if the image is available, else using a default error image
            const img = (option.images[0]) ? option.images[0] : { url: 'assets/error.png' };
            return { id: option.id, image: img, value: option.name };
          })
        },
        secondEnabled: true,
        second: 'Name the track'
      }).catch(error => this.errorSnack.onError('Firebase could not set the new question'))
      this.state.changeState('ANSWER');
      this.play(t.track.uri);
    });
  }

  /**
   * Starts to play a given track, when it starts playing the timer is started
   * @param uri The track to play
   */
  private play(uri: string) {
    let started = false;
    this.playback.play(uri).pipe(
      switchMap(response => interval(1000)),
      switchMap(trigger => this.playback.state()),
      takeWhile(() => !started),
      takeUntil(this.complete$),
      tap((state: any) => {
        if (has(state, 'is_playing') && state.is_playing) {
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

  /**
   * Creates a timer based on the timer constant
   * @returns An `Observable` with type `number` emitting
   * how many seconds has pased
   */
  private get questionTimer(): Observable<number> {
    return timer(1000, 1000).pipe(
      takeWhile(time => time <= QUESTION_MAX_TIMER),
      share()
    );
  }


  /**
   * Observes the user responses and when everybodys done or the times up
   * it sends the results and clears it from firebase, then completes the screen
   */
  private observe() {
    this.log('Activated response observation');

    this.end.subscribe(([players, track, artists, queries]) => {
      this.log('Checking all responses...');
      this.result$.next(players.map(player => {
        if (has(player, 'response')) {
          const response = player.response;
          const result: PlayerResult = {
            id: player.uid,
            question: track.track.id,
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
            question: '',
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


  /**
   * Observes when all players are done or the times up.
   * Adds an delay of 2.5 seconds to let the users responses get into firebase.
   * @returns An `Observable` emitting when one of the actions above occur.
   */
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


  /**
   * Autocompletes the players responses to ignore simple spelling mistakes
   * @param q The players guesses for track names
   * @param track The correct track
   * @returns An `Observable` of the allowed responses
   */
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

  /**
   * Clears the users responses to avoid answers beeing left for the next question
   */
  private clear() {
    this.log('Clearing response data...');
    this.state.code$.pipe(take(1)).subscribe(code => {
      this.db.object(`games/${code}/playerDisplay`).remove()
        .catch(error => this.errorSnack.onError('Firebase could not remove previous questions data'));
      this.db.list('games/' + code + '/players').snapshotChanges().pipe(take(1))
        .subscribe(res => {
          Promise.all(res.map(player => {
            this.db.object(`games/${code}/players/${player.key}/response`).remove();
          })).then(() => this.log('Response data cleared'));
        });
    });
  }

  /**
   * Returns an array of players when all the players are ready
   * @returns An `Observable` of the players
   */
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
      map(([_, players]) => players)
    );
  }

  /**
   * Emitts when the times up on the timer
   * @returns An `Observable` with the amount of seconds passed
   */
  private get timesUP(): Observable<number> {
    return this.timer$.pipe(
      switchMap(t => t),
      filter(time => time === QUESTION_MAX_TIMER),
      tap(() => this.log('Times up'))
    );
  }

  /**
   * When the questions are finished the results a shown for 25 seconds, then the screen is complete.
   */
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
  question: string;
  first: Boolean;
  firstValue: string;
  second: Boolean;
  secondValue: string;
}
