import { Component, OnInit } from '@angular/core';
import { GameHostService } from '../services/game-host.service';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Game, Player, GameState } from '../models/state';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {
  state$: Observable<Game>;
  players$: Observable<Player[]>;
  gameCode$: Observable<string>;
  gameState$: Observable<GameState>;
  adminUID$: Observable<string>;

  constructor(private game: GameHostService) { }

  ngOnInit() {
    this.state$ = this.game.state$;
    this.players$ = this.state$.pipe(
      filter(state => state.players ? true : false),
      map(state => Object.values(state.players))
    );
    this.gameCode$ = this.game.gameCode$;
    this.gameState$ = this.state$.pipe(map(state => state.state));
    this.adminUID$ = this.state$.pipe(filter(state => state.admin ? true : false), map(state => state.admin.playerUID));
  }

}
