import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user$: Observable<User>;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user$ = this.auth.user$;
  }

  loginHost() {
  this.auth.loginWithSpotify().then((thing)=> {console.log(thing); this.router.navigate(['/welcome'])});
  }

  loginPlayer() {
    this.auth.loginAnonymously();
  }

}
