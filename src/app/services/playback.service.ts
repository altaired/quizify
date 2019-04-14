import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap, take, retry, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

/**
 * Takes care of playing at the Playback SDK instance
 * @author Simon Persson, Oskar Norinder
 */

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {

  private SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

  private deviceID = new BehaviorSubject<string>(null);

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) { }

  /**
   * Fetches the available speaker devices using the provided headers
   * @returns An `Observable` of `DeviceR` object
   */
  get devices(): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/me/player/devices';
    return this.auth.authentication.pipe(
      switchMap(headers => {
        return this.http.get(url, { headers: headers })
          .pipe(
            retry(1),
            catchError(this.handleError)
          );
      })
    );
  }

  /**
   * Updates the target device ID
   * @param id The device ID
   */
  updateDeviceID(id: string) {
    this.deviceID.next(id);
    this.log('Updated device id to ' + id);
  }


  /**
   * Fetches the current state of the spotify playback using the provided headers
   * @returns An `Observable` of `StateR` object
   */
  state(): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/me/player';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get(url, { headers: headers })
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
    }));
  }


  /**
   * Plays a provided track using the provided headers
   * @param uri The track URI
   * @returns An empty `Observable` if the request succeeded
   */
  play(uri: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/me/player/play';
    return combineLatest(this.auth.authentication, this.deviceID).pipe(
      switchMap(([headers, id]) => this.http.put(url, { uris: [uri] }, {
        headers: headers, params: {
          device_id: id
        }
      })
        .pipe(
          retry(1),
          catchError(this.handleError)
        )
      )
    );
  }

  /**
   * Pauses the current playback using the provided headers
   * @returns An empty `Observable` if the request succeeded
   */
  pause(): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/me/player/pause';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.put(url, undefined, { headers: headers })
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
    }));
  }

  /**
   * Transfers the playback to the prefered device using the provided headers
   * @returns An empty `Observable` if the request succeeded
   */
  transfer(): Observable<any> {
    return this.deviceID.pipe(take(1), switchMap(id => {
      const url = this.SPOTIFY_BASE_URL + '/me/player';
      return this.auth.authentication.pipe(switchMap(headers => {
        return this.http.put(url, { 'device_ids': [id] }, { headers: headers })
          .pipe(
            retry(1),
            catchError(this.handleError)
          );
      }));
    }));
  }


  /**
   * Logs to the console, prepending a file specific prefix
   * @param msg The message to log
   */
  private log(msg: string) {
    console.log('[Host][Spotify] ' + msg);
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error(error);
    return of(null);
  }

}
