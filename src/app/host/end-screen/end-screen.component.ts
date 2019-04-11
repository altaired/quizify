import { Component, OnInit } from '@angular/core';
import { HistoryHostService } from 'src/app/services/host/history-host.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { SpotifyService } from 'src/app/services/spotify.service';
import { CategoryHostService } from 'src/app/services/host/category-host.service';
import { GameHostService } from 'src/app/services/host/game-host.service';
import { GameState } from 'src/app/models/state';
import { StateHostService } from 'src/app/services/host/state-host.service';



@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.scss']
})
export class EndScreenComponent implements OnInit {

  trackHistory: any[];
  newPlaylist = [];


  constructor(
    private history: HistoryHostService,
    private spotify: SpotifyService,
    private category: CategoryHostService,
    private game: GameHostService,
    private state: StateHostService,
    ) { }

  ngOnInit() {
    this.trackHistory = this.history.playedTracks;
  }

  makePlaylist(){
    console.log('Making Spotify Playlist')
    this.spotify.createPlaylist(this.newPlaylist.map(t=> t.track.id))
  }
  playMore(){
    this.history.resetRounds();
    this.category.start()
  }
  restartGame(){
    this.history.resetGame();
    this.state.changeState('WELCOME');
    this.game.start();

  }

 

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