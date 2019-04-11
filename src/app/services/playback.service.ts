import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

/**
 * The Playback Service takes care of playing the music
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

  get devices() {
    const url = this.SPOTIFY_BASE_URL + '/me/player/devices';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get(url, { headers: headers });
    }));
  }

  updateDeviceID(id: string) {
    this.deviceID.next(id);
    this.log('Updated device id to ' + id);
  }

  state() {
    const url = this.SPOTIFY_BASE_URL + '/me/player';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get(url, { headers: headers });
    }));
  }

  play(uri: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/me/player/play';
    return combineLatest(this.auth.authentication, this.deviceID).pipe(
      switchMap(([headers, id]) => this.http.put(url, { uris: [uri] }, {
        headers: headers, params: {
          device_id: id
        }
      }))
    );
  }


  pause(): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/me/player/pause';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.put(url, undefined, { headers: headers });
    }));
  }

  transfer(): Observable<any> {
    return this.deviceID.pipe(take(1), switchMap(id => {
      const url = this.SPOTIFY_BASE_URL + '/me/player';
      return this.auth.authentication.pipe(switchMap(headers => {
        return this.http.put(url, { 'device_ids': [id] }, { headers: headers });
      }));
    }));
  }

  private log(msg: string) {
    console.log('[Host][Spotify] ' + msg);
  }

}
