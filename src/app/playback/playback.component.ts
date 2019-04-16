import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { SpotifyService } from '../services/spotify.service';
import { PlaybackService } from '../services/playback.service';
import { MatSliderChange, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { PickDeviceComponent } from '../host/pick-device/pick-device.component';


/**
 * Service takning care of the authentication process of hosts and players
 * @author Simon Persson, Oskar Norinder
 */

@Component({
  selector: 'app-playback',
  templateUrl: './playback.component.html',
  styleUrls: ['./playback.component.scss']
})
export class PlaybackComponent implements OnInit {
  private player: Spotify.SpotifyPlayer;
  playerState$ = new BehaviorSubject<Spotify.PlaybackState>(null);
  playing$: Observable<boolean>;
  devices$: Observable<any>;


  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private playback: PlaybackService
  ) {
    this.playing$ = this.playerState$.pipe(map(state => state && !state.paused));
  }

  /**
   * connect the spotify SDK to spotify Servers
   */

  private connectPlayer() {
    this.player.connect().then(success => {
      console.log('Player connected!');

    });
  /**
   * connect Spotify servers to this the spotify SDK vi the SDKs device_id
   */
    this.player.addListener('ready', ({ device_id }) => {
      console.log('Connected with Device ID', device_id);
      this.playback.updateDeviceID(device_id);
      this.playback.transfer();
    });
  /**
   * listen to the playback state
   */
    this.player.addListener('player_state_changed', state => {
      this.playerState$.next(state);
    });

  }
  /**
   * change Spotify SDK volume
   */
  changeVolume(change: MatSliderChange) {
    this.player.setVolume(change.value);
  }


  ngOnInit() {
    this.auth.token$.subscribe(token => {
      this.player = new Spotify.Player({
        name: 'Quizify',
        getOAuthToken: cb => { cb(token); },
        volume: 0.4
      });
      console.log('Playback SDK Ready');
      this.connectPlayer();
    });
  }

  pickDevice() {

  const dialogRef = this.dialog.open(PickDeviceComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
      this.playback.updateDeviceID(result.id)
      }
      })
    };
}
