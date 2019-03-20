import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GamePlayerService } from 'src/app/services/game-player.service';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Game, GameState } from '../../models/state';

@Component({
  selector: 'app-player-display',
  templateUrl: './player-display.component.html',
  styleUrls: ['./player-display.component.scss']
})
export class PlayerDisplayComponent implements OnInit {

  displayName$: Observable<string>;
  adminUID$: Observable<string>
  gameCode$: Observable<string>;
  gameState$: Observable<GameState>;
  state$: Observable<Game>;

  constructor(
    private route: ActivatedRoute,
    private game: GamePlayerService
  ) { }

  ngOnInit() {
    this.gameCode$ = this.game.gameCode$;
    this.state$ = this.game.state$;
    this.gameState$ = this.state$.pipe(map(state => state.state));
    this.displayName$ = this.game.displayName$;
    this.adminUID$ = this.state$.pipe(filter(state => state.admin ? true : false), map(state => state.admin.playerUID));
  }

  startGame() {
    this.game.startGame();
  }

}
