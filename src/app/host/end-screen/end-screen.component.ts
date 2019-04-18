import { Component, OnInit } from '@angular/core';
import { HistoryHostService } from 'src/app/services/host/history-host.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SpotifyService } from 'src/app/services/spotify.service';
import { CategoryHostService } from 'src/app/services/host/category-host.service';
import { GameHostService } from 'src/app/services/host/game-host.service';
import { GameState } from 'src/app/models/state';
import { StateHostService } from 'src/app/services/host/state-host.service';
import { SafePropertyRead } from '@angular/compiler';
import { MatSnackBar } from '@angular/material';
import { switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';

/**
 * Service takning care of the authentication process of hosts and players
 * @author Simon Persson, Oskar Norinder
 */

@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.scss']
})
export class EndScreenComponent implements OnInit {

  playedTracks: SAPI.PlaylistTrackObject[];
  savedTracks: SAPI.PlaylistTrackObject[] = [];


  constructor(
    private history: HistoryHostService,
    private spotify: SpotifyService,
    private game: GameHostService,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.playedTracks = this.history.playedTracks;
  }
  /**
   * Creates a Spotify playlist from the objects in the savedTracks array
   */
  createPlaylist() {
    const tracks: string[] = this.savedTracks.map(track => track.track.uri);
    if (tracks.length > 0) {
      this.spotify.createPlaylist().pipe(
        switchMap(playlist => this.spotify.addToPlaylist(playlist.id, tracks)),
        take(1)
      ).subscribe(() => this.snackbar.open('Playlist created', 'Clear',{duration:5000}));
    } else {
      this.snackbar.open('No tracks to add', 'Clear',{duration:5000});
    }

  }
  /**
   * Returns the state to Pick-category
   */
  playMore() {
    this.game.continue();
  }
    /**
   * Returns the game to Start page
   */
  restartGame() {
    this.router.navigate(['']);
  }

  /**
   * Implementation of the angular Cdk draganddrop to transfer items between the arrays 
   * @param event The drop event by the user
   */
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
