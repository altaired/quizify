import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Game, GameState, Player } from 'src/app/models/state';
import { AngularFireDatabase } from '@angular/fire/database';
import { take, switchMap, filter, map } from 'rxjs/operators';
import { has } from 'lodash';
import { ErrorSnackService } from '../error-snack.service';

/**
 * Service keeping track of the current games state
 * @author Simon Persson, Oskar Norinder
 */

@Injectable({
  providedIn: 'root'
})
export class StateHostService {

  state$: Observable<Game>;
  players$: Observable<Player[]>;
  code$: BehaviorSubject<string> = new BehaviorSubject(null);
  private errorSnack: ErrorSnackService;

  constructor(
    private db: AngularFireDatabase
  ) {
    this.state$ = this.code$.pipe(
      switchMap(code => this.db.object<Game>('games/' + code).valueChanges()),
      filter(state => {
          if (state.state) {
            return true;
          } else {
            return false;
          }
      })
    );
    this.players$ = this.state$.pipe(
      filter(state => has(state, 'players')),
      map(state => Object.values(state.players)),
    );
  }

  /**
   * Updates the game code of the current game
   * @param code The updated code
   */
  setCode(code: string) {
    this.code$.next(code);
  }

  /**
   * Changes the current game state
   * @param state The new game state
   */
  changeState(state: GameState) {
    this.code$.pipe(take(1)).subscribe(code => {
      this.db.object('games/' + code).update({ state: state });
    });
  }
}
