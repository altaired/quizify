import { Component, OnInit } from '@angular/core';
import { GameHostService } from '../services/game-host.service';
import { Observable } from 'rxjs';
import { GameState, Game } from '../models/state';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {
  //gameHost :GameHostService;
  gameState$ :GameState;
  gameCode$ :string;
  show = false;

  constructor(private gameHost: GameHostService) { }

  ngOnInit() {
  }
  getNewGame($event){
    this.gameHost = $event;
    this.gameHost.state$.subscribe(currentGame =>{
        this.gameState$ = currentGame.state;
    });
    
  }
  category(){
    this.show = true;

  }

}
