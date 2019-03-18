import { Component, OnInit } from '@angular/core';
import { GameHostService } from '../services/game-host.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  constructor(private game: GameHostService) { }

  ngOnInit() {
    this.game.newGame('AAAB', 'STANDARD');
  }

}
