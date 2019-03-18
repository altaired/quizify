import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { GamePlayerService } from '../services/game-player.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user$: Observable<User>;

  constructor(
    private auth: AuthService,
    private router: Router,
    private player: GamePlayerService
  ) { }

  ngOnInit() {
    this.user$ = this.auth.user$;
  }

  loginHost() {
    this.auth.loginWithSpotify();
  }

  loginPlayer() {
    this.auth.loginAnonymously();
  }

  joinGame() {
    this.player.join('AAAA', 'Simon');
  }

}
