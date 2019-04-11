import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { CategoriesR } from '../models/spotify';
import { ErrorService } from './error.service';

/**
 * Communicates with Spotifys WEB API
 * @see https://developer.spotify.com
 * @author Simon Persson, Oskar Norinder
 */

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private error: ErrorService
  ) { }

  /**
   * Fetches a track using the provided headers
   * @param id The track ID
   * @returns An `Observable` of the fetched `TrackR` object
   */
  getTrack(id: string): Observable<any> {
    const url = `${this.SPOTIFY_BASE_URL}/tracks/${id}`;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, { headers: headers })
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
    }));
  }

  /**
   * Fetches all available categories from spotify using the provided headers
   * @returns An `Observable` of the fetched `CategoriesR` object
   */
  listCategories(): Observable<CategoriesR> {
    const url = `${this.SPOTIFY_BASE_URL}/browse/categories/`;
    return this.auth.authentication.pipe(switchMap(headers => {
      console.log('[SpotifyService] Fetching categories...');
      return this.http.get<CategoriesR>(url, { headers: headers })
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
    }));
  }

  /**
   * Fetches a given category from Spotify using the provided headers
   * @param id The category ID
   * @returns An `Observable` of the fetched `CategoryR` object
   */
  getCategory(id: string): Observable<any> {
    const url = `${this.SPOTIFY_BASE_URL}/browse/categories/${id}`;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, {
        headers: headers, params: {
          country: 'SE',
          locale: 'sv_SE'
        }
      }).pipe(retry(1), catchError(this.handleError));
    }));
  }

  /**
   * Fetches a given categories playlist using the provided headers
   * @param id The category ID
   * @returns An `Observable` of the fetched `PlaylistsR` object
   */
  getCategoryPlaylists(id: string): Observable<any> {
    const url = `${this.SPOTIFY_BASE_URL}/browse/categories/${id}/playlists`;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, { headers: headers })
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
    }));
  }

  /**
   * Fetches a given artist using the provided headers
   * @param id The artist ID
   * @returns An `Observable` of the fetched `ArtistR` object
   */
  getArtist(id: string): Observable<any> {
    const url = `${this.SPOTIFY_BASE_URL}/artists/${id}`;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, { headers: headers })
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
    }));
  }

  /**
   * Fetches related artists for a given artist using the provided headers
   * @param id The artist ID
   * @returns An `Observable` of the fetched `RelatedArtistsR` object
   */
  getRelatedArtists(id: string): Observable<any> {
    const url = `${this.SPOTIFY_BASE_URL}/artists/${id}/related-artists`;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, { headers: headers })
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
    }));
  }

  /**
   * Fetches a playlists tracks using the provided headers
   * @param id The playlist ID
   * @returns An `Observable` of the fetched `PlaylistTracksR` object
   */
  getPlaylitsTracks(playlist: string) {
    const url = `${this.SPOTIFY_BASE_URL}/playlists/${playlist}/tracks`;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, {
        headers: headers
      }).pipe(retry(1), catchError(this.handleError));
    }));
  }

  /**
   * Fetches search results based on a query using the provided headers
   * @param id The search query
   * @returns An `Observable` of the fetched `SearchR` object
   */
  searchTrack(query: string): Observable<any> {
    const url = `${this.SPOTIFY_BASE_URL}/search`;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, {
        headers: headers,
        params: {
          q: query,
          type: 'track',
          limit: '10'
        }
      }).pipe(retry(1), catchError(this.handleError));
    }));
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    this.error.http(error);
    return of(null);
  }

}
