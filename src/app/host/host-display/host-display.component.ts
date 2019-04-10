import { Component, OnInit } from '@angular/core';
import { GameHostService, QUESTION_MAX_TIMER } from '../../services/host/game-host.service';
import { Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Game, Player, GameState } from '../../models/state';
import { StateHostService } from 'src/app/services/host/state-host.service';
import { QuestionHostService } from 'src/app/services/host/question-host.service';

@Component({
  selector: 'app-host-display',
  templateUrl: './host-display.component.html',
  styleUrls: ['./host-display.component.scss']
})
export class HostDisplayComponent implements OnInit {
  state$: Observable<Game>;
  players$: Observable<Player[]>;
  gameCode$: Observable<string>;
  gameState$: Observable<GameState>;
  adminUID$: Observable<string>;
  timer$: Observable<number>;

  QUESTION_MAX_TIMER = QUESTION_MAX_TIMER;

  constructor(
    private state: StateHostService,
    private game: GameHostService,
    private question: QuestionHostService
  ) { }

  ngOnInit() {
    this.state$ = this.state.state$;
    this.players$ = this.state$.pipe(
      filter(state => state.players ? true : false),
      map(state => Object.values(state.players))
    );
    this.gameCode$ = this.state.code$;
    this.gameState$ = this.state$.pipe(map(state => state.state));
    this.adminUID$ = this.state$.pipe(filter(state => state.admin ? true : false), map(state => state.admin.playerUID));
    this.timer$ = this.question.timer$.pipe(
      filter(t => t ? true : false),
      switchMap(t => t),
      map(val => 100 - (val / QUESTION_MAX_TIMER) * 100)
    );
  }

  introCallback() {
    this.game.introComplete();
  }

}
