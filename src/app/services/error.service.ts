import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private router: Router) { }

  critical() {
    console.log('[Error][Critical] Ending session');
    this.redirect();
  }

  authentication(msg: string) {
    console.log('[Error][Authentication] ' + msg);
  }

  http(response: HttpErrorResponse) {
    console.log('[Error][HTTP] ' + response.error);
  }

  arbitrary(msg: string) {
    console.log('[Error][Arbitrary] ' + msg);
  }

  private redirect() {
    this.router.navigate(['']);
  }
}
