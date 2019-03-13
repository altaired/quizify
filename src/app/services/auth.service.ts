import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token$: Observable<String>;

  constructor() {

  }

  loginWithSpotify() {
    window.open('http://us-central1-quizify-dev.cloudfunctions.net/auth/redirect', 'firebaseAuth', 'height=315,width=400');
  }


}
