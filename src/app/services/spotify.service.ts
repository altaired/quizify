import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { CategoryObj, PlaylistObj, TrackObj } from '../models/spotify';

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

  private get authentication(): Observable<HttpHeaders> {
    return this.token$.pipe(map(token => {
      return new HttpHeaders({
        'Authorization': 'Bearer ' + token
      });
    }));
  }


}
