import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  loginHost() {
    this.auth.loginWithSpotify();
  }

  loginPlayer() {
    this.auth.loginAnonymously();
  }

}
