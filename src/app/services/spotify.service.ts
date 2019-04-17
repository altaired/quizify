import { Injectable } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { switchMap, catchError, retry, map, take, tap } from 'rxjs/operators';
import { ErrorSnackService } from './error-snack.service';

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
    private errorSnack: ErrorSnackService
  ) { }

  /**
   * Fetches a track using the provided headers
   * @param id The track ID
   * @returns An `Observable` of the fetched `TrackObject` object
   */
  getTrack(id: string): Observable<SAPI.TrackObject> {
    const url = `${this.SPOTIFY_BASE_URL}/tracks/${id}`;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<any>(url, { headers: headers })
        .pipe(
          retry(1),
          catchError(err => this.handleError(err))
        );
    }));
  }

  /**
   * Fetches all available categories from spotify using the provided headers
   * @returns An `Observable` of the fetched `PagingObject` object with type `CategoryObject`.
   */
  listCategories(): Observable<SAPI.PagingObject<SAPI.CategoryObject>> {
    const url = `${this.SPOTIFY_BASE_URL}/browse/categories/`;
    return this.auth.authentication.pipe(switchMap(headers => {
      console.log('[SpotifyService] Fetching categories...');
      return this.http.get<{ categories: SAPI.PagingObject<SAPI.CategoryObject> }>(url, { headers: headers })
        .pipe(
          retry(1),
          catchError(err => this.handleError(err)),
          map(res => res.categories)
        );
    }));
  }

  /**
   * Fetches a given category from Spotify using the provided headers
   * @param id The category ID
   * @returns An `Observable` of the fetched `CategoryObject` object
   */
  getCategory(id: string): Observable<SAPI.CategoryObject> {
    const url = `${this.SPOTIFY_BASE_URL}/browse/categories/${id}`;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<SAPI.CategoryObject>(url, {
        headers: headers, params: {
          country: 'SE',
          locale: 'sv_SE'
        }
      }).pipe(retry(1), catchError(err => this.handleError(err)));
    }));
  }

  /**
   * Fetches a given categories playlist using the provided headers
   * @param id The category ID
   * @returns An `Observable` of the fetched `PagingObject` object with type `PlaylistObject`.
   */
  getCategoryPlaylists(id: string): Observable<SAPI.PagingObject<SAPI.PlaylistObject>> {
    const url = `${this.SPOTIFY_BASE_URL}/browse/categories/${id}/playlists`;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<{ playlists: SAPI.PagingObject<SAPI.PlaylistObject> }>(url, { headers: headers })
        .pipe(
          retry(1),
          catchError(err => this.handleError(err)),
          map(res => res.playlists)
        );
    }));
  }

  /**
   * Fetches a given artist using the provided headers
   * @param id The artist ID
   * @returns An `Observable` of the fetched `ArtistObject` object
   */
  getArtist(id: string): Observable<SAPI.ArtistObject> {
    const url = `${this.SPOTIFY_BASE_URL}/artists/${id}`;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<SAPI.ArtistObject>(url, { headers: headers })
        .pipe(
          retry(1),
          catchError(err => this.handleError(err))
        );
    }));
  }

  /**
   * Fetches related artists for a given artist using the provided headers
   * @param id The artist ID
   * @returns An `Observable` of the fetched `ArtistObject` array
   */
  getRelatedArtists(id: string): Observable<SAPI.ArtistObject[]> {
    const url = `${this.SPOTIFY_BASE_URL}/artists/${id}/related-artists`;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<{ artists: SAPI.ArtistObject[] }>(url, { headers: headers })
        .pipe(
          retry(1),
          catchError(err => this.handleError(err)),
          map(res => res.artists)
        );
    }));
  }

  /**
   * Fetches a playlists tracks using the provided headers
   * @param id The playlist ID
   * @returns An `Observable` of the fetched `PagingObject` object with type `TrackObject`.
   */
  getPlaylitsTracks(playlist: string): Observable<SAPI.PagingObject<SAPI.PlaylistTrackObject>> {
    const url = `${this.SPOTIFY_BASE_URL}/playlists/${playlist}/tracks`;
    return this.auth.authentication.pipe(switchMap(headers => {
      return this.http.get<SAPI.PagingObject<SAPI.PlaylistTrackObject>>(url, {
        headers: headers
      }).pipe(retry(1), catchError(err => this.handleError(err)));
    }));
  }

  /**
   * Creates an empty playlist using the provided headers
   * @returns An `Observable` of the created `PlaylistObject` object
   */
  createPlaylist(): Observable<SAPI.PlaylistObject> {
    return combineLatest(
      this.auth.authentication,
      this.auth.user$.pipe(map(user => user.uid))
    ).pipe(switchMap(([headers, uid]) => {
      const url = `${this.SPOTIFY_BASE_URL}/users/${uid}/playlists`;
      return this.http.post<SAPI.PlaylistObject>(url, {
        name: 'Quizify Playlist',
        public: false,
        description: 'Playlist was automaticly created by Quizify on the users behalf'
      }, {
          headers: headers
        }).pipe(
          retry(1),
          catchError(err => this.handleError(err))
        );
    }));
  }

  /**
   * Adds tracks to a given playlist using the provided headers
   * @param playlist The playlist ID
   * @param tracks An array of Track URI:s
   */
  addToPlaylist(playlist: string, tracks: string[]): Observable<any> {
    return this.auth.authentication.pipe(
      switchMap(headers => {
        const url = `${this.SPOTIFY_BASE_URL}/playlists/${playlist}/tracks`;
        return this.http.post<any>(url, {
          uris: tracks
        }, { headers: headers });
      })
    );
  }

  /**
   * Fetches search results based on a query using the provided headers
   * @param id The search query
   * @returns An `Observable` of the fetched results
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
      }).pipe(retry(1), catchError(err => this.handleError(err)));
    }));
  }

  /**
   * Displays error messages via as snackbar items via ErrorSnackService
   * @param error The spotify error to handle
   * @returns An `Observable` of always null
   */
  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error(error);
    this.errorSnack.onError('Spotify returned this: '+ error.message ? error.message: '','Clear',10000);
    return of(null);
  }

}
