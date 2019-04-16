import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GameHostService } from 'src/app/services/host/game-host.service';
import { Router } from '@angular/router';
import { Hash } from 'src/app/utils/hash';
import { GameMode } from 'src/app/models/state';

/**
 * Service takning care of the authentication process of hosts and players
 * @author Simon Persson, Oskar Norinder
 */

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
    /**
   * Begins a game in standard mode
   */
  createStandard() {
    this.game.newGame('STANDARD');
  }
  createPassive() {
    console.log("sorry not done yet")
  }
}
