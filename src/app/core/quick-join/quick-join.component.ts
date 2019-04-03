import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { GamePlayerService } from 'src/app/services/game-player.service';
import { JoinDialogComponent } from 'src/app/player/join-dialog/join-dialog.component';

@Component({
  selector: 'app-quick-join',
  templateUrl: './quick-join.component.html',
  styleUrls: ['./quick-join.component.scss']
})
export class QuickJoinComponent implements OnInit {
  code: String;
  dialogConfig :MatDialogConfig;
  constructor(
  private route: ActivatedRoute,
  public dialog: MatDialog,
  private auth: AuthService,
  private router: Router,
  private player: GamePlayerService
  ){}
  ngOnInit() {
    this.dialogConfig = new MatDialogConfig();
    this.route.queryParams.subscribe(params => {
      if (params.code){
        this.dialogConfig.data =  params.code;
        this.loginPlayer();
      }
    });
}
async loginPlayer() {
  await this.auth.loginAnonymously();
  this.dialogConfig.autoFocus = true;
  const dialogRef = this.dialog.open(JoinDialogComponent, this.dialogConfig);
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
