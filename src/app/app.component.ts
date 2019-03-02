/// <reference types="spotify-web-playback-sdk" />

import { Component } from '@angular/core';
import { I18nSelectPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'app';
  private player: Spotify.SpotifyPlayer;

  constructor() {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = 'BQBx5Isi0AFEjss1FZ_Jww7D69zf5_esqP0UnkUFRdzztp4ISuNwFbUQkEwj5R84sl1_zW0o2HAWwG1jxl0jQ782aqb0sDPXOnwhS0WFPH-iRrzYONLxgYXqb0mdFRIDo51HVcMDcbSmflcSfmqGM0hHdVX9FBYKxgze5F7j';
      this.player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); }
      });
      this.connectPlayer();
    };
  }

  private connectPlayer() {
    this.player.connect().then(success => console.log('Player connected!'));
    this.player.addListener('player_state_changed', this.updatePlaybackState);
  }

  private updatePlaybackState(state: Spotify.PlaybackState) {
    console.log(state);
  }

  togglePlay() {
    this.player.togglePlay().then(() => console.log('Toggle!'));
  }

}
