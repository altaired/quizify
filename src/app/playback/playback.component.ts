import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { Observable, fromEvent, BehaviorSubject } from 'rxjs';
import { SpotifyService } from '../services/spotify.service';
import { auth } from 'firebase';


@Component({
  selector: 'app-playback',
  templateUrl: './playback.component.html',
  styleUrls: ['./playback.component.scss']
})
export class PlaybackComponent implements OnInit {
  artist :string;
  currentTrack : string;
  artistChoices:Object[];
  private player: Spotify.SpotifyPlayer;
  playerState$ = new BehaviorSubject<Spotify.PlaybackState>(null);
  categories$: Observable<any>;
  devices$: Observable<any>;


  constructor(
    private auth: AuthService,
    private spotifyService: SpotifyService
  ) {
    this.categories$ = spotifyService.listCategories();
    this.devices$ = spotifyService.getDevices();
  }

  private connectPlayer() {
    this.player.connect().then(success => {
      console.log('Player connected!');
      
    });
    this.player.addListener('ready', ({ device_id }) => {
      console.log('Connected with Device ID', device_id);
      this.spotifyService.Transfer(device_id).subscribe();
      this.player.setVolume(0.1).then(() => console.log("ljudet sänkt så man inte dör"))
    });
    this.player.addListener('player_state_changed', state =>{
      this.playerState$.next(state);
      if (state){
        console.log(state);
        if (this.currentTrack != state.track_window.current_track.name){
          this.artistChoices = [];
          this.currentTrack = state.track_window.current_track.name;
          this.artist = state.track_window.current_track.artists[0].uri;
          this.spotifyService.getArtist(this.artist.replace("spotify:artist:","")).subscribe(x => {
            this.artistChoices.push(  { name : x.name, images : x.images  });
            this.spotifyService.getRelatedArtists(this.artist.replace("spotify:artist:","")).subscribe(y => {
              y.artists.map(x => {
                this.artistChoices.push(  { name : x.name, images : x.images  });
              })
              this.auth.setArtists(this.artistChoices.slice(0,4));
          })
          });

          
         }
       }
      });

  }


  Play(){
    console.log("Play");
    this.spotifyService.Play().subscribe();
  }
  Pause(){
    console.log("Pause");
    this.spotifyService.Pause().subscribe();
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
