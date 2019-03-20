import { Component, OnInit } from '@angular/core';
import { GameHostService } from '../services/game-host.service';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Game, Player } from '../models/state';
import { GameCreateRequest } from '../host/game-creation/game-creation.component';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {
  state$: Observable<Game>;
  players$: Observable<Player[]>;
  gameCode$: Observable<string>;

  show: boolean;

  constructor(private game: GameHostService) { }

  ngOnInit() {
    this.state$ = this.game.state$;
    this.players$ = this.state$.pipe(
      filter(state => state.players ? true : false),
      map(state => Object.values(state.players))
    );
    this.gameCode$ = this.game.gameCode$;
  }

  newGame(req: GameCreateRequest) {
    this.game.newGame(req.code, req.mode);
  }

  category() {
    this.show = true;
  }

}
