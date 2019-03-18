import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
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
    this.transfer(id).pipe(take(1)).subscribe(() => console.log('transfer'));
  }

  play(id: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/me/player/play';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.put(url, undefined, { headers: headers });
    }));
  }
  pause(): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/me/player/pause';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.put(url, undefined, { headers: headers });
    }));
  }

  transfer(device_id: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/me/player';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.put(url, { 'device_ids': [device_id] }, { headers: headers });
    }));
  }

}
