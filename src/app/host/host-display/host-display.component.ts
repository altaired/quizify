import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { QUESTION_MAX_TIMER } from '../../services/host/question-host.service';
import { Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Game, Player, GameState } from '../../models/state';
import { StateHostService } from 'src/app/services/host/state-host.service';
import { QuestionHostService } from 'src/app/services/host/question-host.service';
import { GameHostService } from 'src/app/services/host/game-host.service';
/**
 * Top component for the host in a game switching between different sub-components on different stages of the game
 * @author Simon Persson, Oskar Norinder
 */
@Component({
  selector: 'app-host-display',
  templateUrl: './host-display.component.html',
  styleUrls: ['./host-display.component.scss']
})
export class HostDisplayComponent implements OnInit, OnDestroy {
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

    ngOnDestroy() {
      this.game.delete();
    }


    @HostListener('window:beforeunload', [ '$event' ])
  /**
   * When the host closes the window remove the game
   * @param  event triggered by the window closing
   */
    beforeUnloadHander(event) {
      this.game.delete();
    }
  /**
   * When the intro timer is complete continue with the game
   */
  introCallback() {
    this.game.introComplete();
  }

}
