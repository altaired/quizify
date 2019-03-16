import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { Observable, fromEvent, BehaviorSubject } from 'rxjs';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-playback',
  templateUrl: './playback.component.html',
  styleUrls: ['./playback.component.scss']
})
export class PlaybackComponent implements OnInit {

  private player: Spotify.SpotifyPlayer;
  playerState$ = new BehaviorSubject<Spotify.PlaybackState>(null);
  categories$: Observable<any>;

  constructor(
    private auth: AuthService,
    private spotifyService: SpotifyService
  ) {
    this.categories$ = spotifyService.listCategories();
  }

  private connectPlayer() {
    this.player.connect().then(success => console.log('Player connected!'));
    this.player.addListener('player_state_changed', state => this.playerState$.next(state));

  }

  ngOnInit() {
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('Playback SDK Ready');
      this.auth.token$.subscribe(token => {
        this.player = new Spotify.Player({
          name: 'Quizify',
          getOAuthToken: cb => { cb(token); }
        });
        this.connectPlayer();
      });
    };
  }

}
