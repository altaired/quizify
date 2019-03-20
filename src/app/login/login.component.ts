import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { GamePlayerService } from '../services/game-player.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { JoinDiagComponent } from '../player/join-diag/join-diag.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user$: Observable<User>;
  name: string;
  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private router: Router,
    private player: GamePlayerService
  ) { }

  ngOnInit() {
    this.user$ = this.auth.user$;
  }

  async loginHost() {
    await this.auth.loginWithSpotify();
    this.router.navigate(['/create-game']);
  }

  async loginPlayer() {
    await this.auth.loginAnonymously();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(JoinDiagComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result && result.gameCode && result.name) {
        this.player.join(result.gameCode, result.name).then(success => {
          this.router.navigate(['/game']);
        }).catch(error => {
          console.error(error);
        });

      }
    });
  }



}
