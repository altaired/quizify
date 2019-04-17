import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { GamePlayerService } from '../../services/game-player.service';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { JoinDialogComponent } from '../../player/join-dialog/join-dialog.component';
import { ErrorSnackService } from 'src/app/services/error-snack.service';

/**
 * Component showing the of the login options of hosts and players
 * @author Simon Persson, Oskar Norinder
 */

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
    private player: GamePlayerService,
    private errorSnack: ErrorSnackService
  ) { }

  ngOnInit() {
    this.user$ = this.auth.user$;
  }
 /**
   * Routes the game on successful login
   */
  async loginHost() {
    await this.auth.loginWithSpotify();
    this.router.navigate(['/create-game']);
  }
 /**
   * Opens a dialog for the gamecode and if the game exists navigates to it
   */
  async loginPlayer() {
    await this.auth.loginAnonymously();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(JoinDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result && result.gameCode && result.name) {
        this.player.join(result.gameCode, result.name).then(success => {
          this.router.navigate(['/game']);
        }).catch(error => {
          this.errorSnack.onError(error);
        });

      }
    });
  }



}
