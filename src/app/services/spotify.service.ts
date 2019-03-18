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

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) { }

  getTrack(id: string): Observable<TrackObj> {
    const url = this.SPOTIFY_BASE_URL + '/tracks/' + id;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<TrackObj>(url, { headers: headers });
    }));
  }

  listCategories(): Observable<CategoryObj[]> {
    const url = this.SPOTIFY_BASE_URL + '/browse/categories/';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<CategoryObj[]>(url, { headers: headers });
    }));
  }

  getCategory(id: string): Observable<CategoryObj> {
    const url = this.SPOTIFY_BASE_URL + '/browse/categories/' + id;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<CategoryObj>(url, { headers: headers });
    }));
  }

  getCategoryPlaylists(id: string): Observable<PlaylistObj[]> {
    const url = this.SPOTIFY_BASE_URL + '/browse/categories/' + id + '/playlists';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<PlaylistObj[]>(url, { headers: headers });
    }));
  }

  getArtist(id: string): Observable<ArtistObj> {
    const url = this.SPOTIFY_BASE_URL + '/artists/' + id;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<ArtistObj>(url, { headers: headers });
    }));
  }
  getRelatedArtists(id: string): Observable<RelatedArtists> {
    const url = this.SPOTIFY_BASE_URL + '/artists/' + id + '/related-artists';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<RelatedArtists>(url, { headers: headers });
    }));
  }

}
