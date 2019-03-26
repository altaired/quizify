import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GamePlayerService } from 'src/app/services/game-player.service';
import { Observable, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Game, GameState, CategoryOption, CategoryState } from '../../models/state';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-player-display',
  templateUrl: './player-display.component.html',
  styleUrls: ['./player-display.component.scss']
})
export class PlayerDisplayComponent implements OnInit {



  displayName$: Observable<string>;
  adminUID$: Observable<string>;
  gameCode$: Observable<string>;
  gameState$: Observable<GameState>;
  state$: Observable<Game>;

  isCategoryPicker$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private game: GamePlayerService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.gameCode$ = this.game.gameCode$;
    this.state$ = this.game.state$;
    this.gameState$ = this.state$.pipe(map(state => state.state));
    this.displayName$ = this.game.displayName$;
    this.adminUID$ = this.state$.pipe(filter(state => state.admin ? true : false), map(state => state.admin.playerUID));
    this.isCategoryPicker$ = combineLatest(this.state$, this.auth.user$)
      .pipe(map(([state, user]) => {
        if (state.playerDisplay) {
          return state.playerDisplay.category.playerUID === user.uid;
        } else {
          return false;
        }
      }));
  }

  startGame() {
    this.game.startGame();
  }

  selectCategory(option: string) {
    console.log('Category picked', option);
  }

}
