import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { SpotifyService } from '../services/spotify.service';
import { PlaybackService } from '../services/playback.service';


@Component({
  selector: 'app-playback',
  templateUrl: './playback.component.html',
  styleUrls: ['./playback.component.scss']
})
export class PlaybackComponent implements OnInit {
  private player: Spotify.SpotifyPlayer;
  playerState$ = new BehaviorSubject<Spotify.PlaybackState>(null);
  playing$: Observable<boolean>;


  constructor(
    private auth: AuthService,
    private playback: PlaybackService
  ) {
    this.playing$ = this.playerState$.pipe(map(state => state && !state.paused));
  }

  private connectPlayer() {
    this.player.connect().then(success => {
      console.log('Player connected!');

    });

    this.player.addListener('ready', ({ device_id }) => {
      console.log('Connected with Device ID', device_id);
      this.playback.updateDeviceID(device_id);
    });

    this.player.addListener('player_state_changed', state => {
      this.playerState$.next(state);
    });

  }

  play() {
    this.playback.play('').pipe(take(1))
      .subscribe(res => console.log('play', res));
  }
  pause() {
    this.playback.pause().pipe(take(1))
      .subscribe(res => console.log('play', res));
  }

  ngOnInit() {
    this.auth.token$.subscribe(token => {
      this.player = new Spotify.Player({
        name: 'Quizify',
        getOAuthToken: cb => { cb(token); },
        volume: 0.1
      });
      console.log('Playback SDK Ready');
      this.connectPlayer();
    });
  }

}
