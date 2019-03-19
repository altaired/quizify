import { Component, OnInit, Input } from '@angular/core';
import { GameHostService } from '../services/game-host.service';
import { Game, Player } from '../models/state';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  @Input() gameHost: GameHostService;
  players: Player[];
  gameCode: string;

  constructor() { }
  
  ngOnInit() {
    this.gameHost.getGameCode().subscribe(code => this.gameCode=code);
    this.gameHost.getPlayers().subscribe(players => this.players = players);
  }



}
