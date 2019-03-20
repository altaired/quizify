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

  @Output() newGame = new EventEmitter<GameCreateRequest>();

  private hash = new Hash('quizify is the best', 4, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');


  constructor(private game: GameHostService, private router: Router) { }

  ngOnInit() {
  }
  createStandard() {
    const date = new Date().getTime();
    const res = this.hash.encode(date);
    this.newGame.emit({ code: res, mode: 'STANDARD' });
  }
  createPassive() {
    console.log("sorry not done yet")
  }
}

export interface GameCreateRequest {
  code: string;
  mode: GameMode;
}
