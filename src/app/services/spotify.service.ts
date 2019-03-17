import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { CategoryObj, PlaylistObj, TrackObj, ArtistObj, RelatedArtists, Devices } from '../models/spotify';

/**
 * Communicates with Spotifys WEB API
 */

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

  private token$: Observable<string>;

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {
    this.token$ = this.auth.token$;
  }

  getTrack(id: string): Observable<TrackObj> {
    const url = this.SPOTIFY_BASE_URL + '/tracks/' + id;
    return this.authentication.pipe(switchMap(headers => {
      return this.http.get<TrackObj>(url, { headers: headers });
    }));
  }

  listCategories(): Observable<CategoryObj[]> {
    const url = this.SPOTIFY_BASE_URL + '/browse/categories/';
    return this.authentication.pipe(switchMap(headers => {
      return this.http.get<CategoryObj[]>(url, { headers: headers });
    }));
  }

  getCategory(id: string): Observable<CategoryObj> {
    const url = this.SPOTIFY_BASE_URL + '/browse/categories/' + id;
    return this.authentication.pipe(switchMap(headers => {
      return this.http.get<CategoryObj>(url, { headers: headers });
    }));
  }

  getCategoryPlaylists(id: string): Observable<PlaylistObj[]> {
    const url = this.SPOTIFY_BASE_URL + '/browse/categories/' + id + '/playlists';
    return this.authentication.pipe(switchMap(headers => {
      return this.http.get<PlaylistObj[]>(url, { headers: headers });
    }));
  }

  getDevices(): Observable<Devices> {
    const url = this.SPOTIFY_BASE_URL + '/me/player/devices';
    return this.authentication.pipe(switchMap(headers => {
      return this.http.get<Devices>(url, { headers: headers });
    }));
  }
  Play(): Observable<never> {
    const url = this.SPOTIFY_BASE_URL + '/me/player/play';
    return this.putAuthentication.pipe(switchMap(headers => {
      return this.http.put<never>(url, undefined, { headers: headers });
    }));
  }
  Pause(): Observable<never> {
    const url = this.SPOTIFY_BASE_URL + '/me/player/pause';
    return this.putAuthentication.pipe(switchMap(headers => {
      return this.http.put<never>(url, undefined, { headers: headers });
    }));
  }

  Transfer(device_id: string): Observable<never> {
    const url = this.SPOTIFY_BASE_URL + '/me/player';
    return this.putAuthentication.pipe(switchMap(headers => {
      return this.http.put<never>(url, { "device_ids": [device_id] }, { headers: headers });
    }));
  }

  getArtist(id: string): Observable<ArtistObj> {
    const url = this.SPOTIFY_BASE_URL + '/artists/' + id;
    return this.authentication.pipe(switchMap(headers => {
      return this.http.get<ArtistObj>(url, { headers: headers });
    }));
  }
  getRelatedArtists(id: string): Observable<RelatedArtists> {
    const url = this.SPOTIFY_BASE_URL + '/artists/' + id + '/related-artists';
    return this.authentication.pipe(switchMap(headers => {
      return this.http.get<RelatedArtists>(url, { headers: headers });
    }));
  }


  private get authentication(): Observable<HttpHeaders> {
    return this.token$.pipe(map(token => {
      return new HttpHeaders({
        'Authorization': 'Bearer ' + token
      });
    }));
  }

  private get putAuthentication(): Observable<HttpHeaders> {
    return this.token$.pipe(map(token => {
      return new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      });
    }));
  }



}
