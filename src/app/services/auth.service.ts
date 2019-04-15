import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase/app';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { switchMap, map, filter } from 'rxjs/operators';

/**
 * Service takning care of the authentication process of hosts and players
 * @author Simon Persson, Oskar Norinder
 */

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token$: Observable<string>;
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {
    this.user$ = afAuth.authState;
    this.token$ = this.user$
      .pipe(
        filter(user => user ? true : false),
        switchMap(user => this.getToken(user.uid)));

  }

  /**
   * Gets the accesToken for a given user
   * @param uid The users uniqe identifier
   */
  private getToken(uid: string): Observable<string> {
    return this.db.object<Token>('users/' + uid)
      .valueChanges()
      .pipe(
        filter(token => token.accessToken ? true : false),
        map(token => token.accessToken)
      );
  }

  /**
   * Signs in the user using the credentials and token provided by the backend
   */
  loginWithSpotify(): Promise<any> {
    return this.authenticate()
      .then(token => this.afAuth.auth.signInWithCustomToken(token))
      .catch(error => console.error(error));
  }

  /**
   * Starts the authentication process with Spotify and the backend
   */
  private authenticate(): Promise<string> {
    const url = environment.authentication.authDomain;
    return new Promise((resolve, reject) => {
      window.open(url, 'Spotify', 'height=600,width=400');
      window.addEventListener('message', event => {
        if (event.data.type && event.data.type === 'auth') {
          if (event.data.token) {
            resolve(event.data.token);
          }
        }
        reject('Invalid token');
      }, false);
    });
  }

  /**
   * Signs the user in anonymously, used for the players
   */
  loginAnonymously() {
    this.afAuth.auth.signInAnonymously().catch(function (error) {
      console.error(error);
    });
  }

  /**
   * Returns the needed authentication headers for the Spotify API
   * @returns An `Observable` of `HttpHeaders`
   */
  get authentication(): Observable<HttpHeaders> {
    return this.token$.pipe(map(token => {
      return new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      });
    }));
  }

}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

