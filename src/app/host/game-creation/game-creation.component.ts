import { Component, OnInit } from '@angular/core';
import { GameHostService } from 'src/app/services/game-host.service';

@Component({
  selector: 'app-game-creation',
  templateUrl: './game-creation.component.html',
  styleUrls: ['./game-creation.component.scss']
})
export class GameCreationComponent implements OnInit {

  constructor(private game: GameHostService) { }

  ngOnInit() {
  }
  createStandard(){
    this.game.newGame('AAAB', 'STANDARD');
  }
  createPassive(){
    console.log("sorry not done yet")
  }
}
