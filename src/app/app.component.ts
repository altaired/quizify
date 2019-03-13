/// <reference types="spotify-web-playback-sdk" />

import { Component } from '@angular/core';

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
      const token = 'BQDT0_BZs-nykOHbuwGqrp5WF3ECO60AWPaqEe0H5YktRiyahbS9Iyteifi33hu8woS1-8ja2AoQJFv5QaLl1ek75NN-u1EiWKBu_LrTEMPMSaSZ-KF2WVM2cF73JsH_KSnWwwPDdUzN88heYm4wsKXwoRF4W3GN1mK-ivu0';
      this.player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); }
      });
      this.connectPlayer();
    };
  }

  private connectPlayer() {
    this.player.connect().then(success => console.log('Player connected!'));
    this.player.addListener('player_state_changed', console.log);
  }

  togglePlay() {
    window.open('http://us-central1-quizify-dev.cloudfunctions.net/auth/redirect', 'firebaseAuth', 'height=315,width=400');
    // this.player.togglePlay().then(() => console.log('Toggle!'));
  }



}
