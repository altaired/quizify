import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { switchMap, map, filter, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token$: Observable<string>;
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router
  ) {
    this.user$ = afAuth.authState;
    this.token$ = this.user$
      .pipe(
        filter(user => user ? true : false),
        switchMap(user => this.getToken(user.uid)));

  }

  private getToken(uid: string): Observable<string> {
    return this.db.object<Token>('users/' + uid)
      .valueChanges()
      .pipe(
        filter(token => token.accessToken ? true : false),
        map(token => token.accessToken)
      );
  }

  loginWithSpotify(): Promise<any> {
    return this.authenticate()
      .then(token => this.afAuth.auth.signInWithCustomToken(token))
      .catch(error => console.error(error));
  }

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

  loginAnonymously() {
    this.afAuth.auth.signInAnonymously().catch(function (error) {
      console.error(error);
    });
  }

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

