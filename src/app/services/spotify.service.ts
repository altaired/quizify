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

  getTrack(id: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/tracks/' + id;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, { headers: headers });
    }));
  }

  listCategories(): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/browse/categories/';
    return this.auth.authentication.pipe(switchMap(headers => {
      console.log('[SpotifyService] Fetching categories...');
      return this.http.get<any[]>(url, { headers: headers });
    }));
  }

  getCategory(id: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/browse/categories/' + id;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, {
        headers: headers, params: {
          country: 'SE',
          locale: 'sv_SE'
        }
      });
    }));
  }

  getCategoryPlaylists(id: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/browse/categories/' + id + '/playlists';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, { headers: headers });
    }));
  }

  getArtist(id: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/artists/' + id;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, { headers: headers });
    }));
  }
  getRelatedArtists(id: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/artists/' + id + '/related-artists';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, { headers: headers });
    }));
  }

  getPlaylitsTracks(playlist: string) {
    const url = this.SPOTIFY_BASE_URL + '/playlists/' + playlist + '/tracks';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, {
        headers: headers
      });
    }));
  }

  searchTrack(query: string): Observable<any> {
    const url = this.SPOTIFY_BASE_URL + '/search';
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, {
        headers: headers,
        params: {
          q: query,
          type: 'track',
          limit: '5'
        }
      });
    }));
  }

}
