import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { headersToString } from 'selenium-webdriver/http';

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

  getTrack(id: string): Observable<Spotify.Track> {
    const url = this.SPOTIFY_BASE_URL + '/tracks/' + id;
    return this.authentication.pipe(switchMap(headers => {
      return this.http.get<Spotify.Track>(url, { headers: headers });
    }));
  }

  listCategories(): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/browse/categories/';
    return this.authentication.pipe(switchMap(headers => {
      return this.http.get(url, { headers: headers });
    }));
  }

  getCategory(id: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/browse/categories/' + id;
    return this.authentication.pipe(switchMap(headers => {
      return this.http.get(url, { headers: headers });
    }));
  }

  getCategoryPlaylists(id: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/browse/categories/' + id + '/playlists';
    return this.authentication.pipe(switchMap(headers => {
      return this.http.get(url, { headers: headers });
    }));
  }

  getDevices(): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/me/player/devices';
    return this.authentication.pipe(switchMap(headers => {
      return this.http.get(url, { headers: headers });
    }));
  }
   Play(): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/me/player/play';
    return this.putAuthentication.pipe(switchMap(headers => {
      return this.http.put(url, undefined, { headers: headers });
    }));
  } 
  Pause(): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/me/player/pause';
    return this.putAuthentication.pipe(switchMap(headers => {
      return this.http.put(url, undefined, { headers: headers });
    }));
  } 

  Transfer(device_id: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/me/player';
    return this.putAuthentication.pipe(switchMap(headers => {
      return this.http.put(url, {"device_ids":[device_id]}, { headers: headers });
    }));
  } 
  
  getArtist(id: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/artists/' + id ;
    return this.authentication.pipe(switchMap(headers => {
      return this.http.get(url, { headers: headers });
    }));
  }
  getRelatedArtists(id: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/artists/'+ id+ '/related-artists';
    return this.authentication.pipe(switchMap(headers => {
      return this.http.get(url, { headers: headers });
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
        'Accept' : 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      });
    }));
  }



}
