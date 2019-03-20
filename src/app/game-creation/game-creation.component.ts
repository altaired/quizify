import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GameHostService } from 'src/app/services/game-host.service';
import { Router } from '@angular/router';
import { Hash } from 'src/app/utils/hash';
import { GameMode } from 'src/app/models/state';

@Component({
  selector: 'app-game-creation',
  templateUrl: './game-creation.component.html',
  styleUrls: ['./game-creation.component.scss']
})
export class GameCreationComponent implements OnInit {

  private hash = new Hash('INTERACTIONPROGRAMMING', 4, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');


  constructor(private game: GameHostService, private router: Router) { }

  ngOnInit() {
  }
  createStandard() {
    const date = new Date();
    const val = `${date.getMinutes()}${date.getHours()}${date.getUTCMilliseconds()}`;
    const res = this.hash.encode(val);
    this.game.newGame(res, 'STANDARD');
  }
  createPassive() {
    console.log("sorry not done yet")
  }
}
