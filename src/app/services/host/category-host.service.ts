import { Injectable } from '@angular/core';
import { GameHostService } from './game-host.service';
import { Observable, combineLatest, Subject } from 'rxjs';
import { take, map, takeUntil } from 'rxjs/operators';
import { SpotifyService } from '../spotify.service';
import { CATEGORY_WHITELIST } from '../../utils/whitelist';
import { Player, Option, CategoryState, Game, GameState } from '../../models/state';
import { HistoryHostService } from './history-host.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { StateHostService } from './state-host.service';
import { ErrorSnackService } from '../error-snack.service';

/**
 * Service taking care of everything related to the category picking
 * @author Simon Persson, Oskar Norinder
 */

@Injectable({
  providedIn: 'root'
})
export class CategoryHostService {

  complete$ = new Subject<string>();

  constructor(
    private spotify: SpotifyService,
    private history: HistoryHostService,
    private db: AngularFireDatabase,
    private state: StateHostService,
    private errorSnack: ErrorSnackService,
  ) { }

  /**
   * Starts the category picking by getting 6 random categories to pick from
   */
  start() {
    this.log('Starting category picking...');
    combineLatest(this.spotify.listCategories().pipe(
      map(res => {
        const categories = res.items;
        const allowed = categories.filter(c => CATEGORY_WHITELIST.some(id => c.id === id));
        const shuffled = allowed.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6);
        return selected;
      })
    ),
      this.state.players$
    ).pipe(take(1))
      .subscribe(([categories, players]) => {
        this.log('Category picking started');
        this.distribute(categories, players);
      });
  }

  /**
   * Distributes the categories to the players using firebase
   * @param categories The random categories
   * @param players The players in the game
   */
  private distribute(categories, players: Player[]) {
    const code = this.state.code$.getValue();
    const options = categories.map(category => {
      const categoryObj: Option = {
        id: category.id,
        value: category.name,
        image: category.icons[0]
      };
      return categoryObj;
    });

    const selectedPlayer = this.findPicker(players);

    const categoryState: CategoryState = {
      playerUID: selectedPlayer.uid,
      done: false,
      options: options
    };
    this.db.object('games/' + code + '/playerDisplay/category')
      .set(categoryState)
      .catch(error => this.errorSnack.onError('Firebase could not set category and returned this: ' + error));
    this.state.changeState('PICK_CATEGORY');
    this.observe();
    this.log('Waiting for player to pick a category');
  }

  private findPicker(players: Player[]) {
    const selectedPlayer = players.find(player =>
      this.history.validatePicker(player.uid)
    );
    if (!selectedPlayer) {
      this.history.clearPickers();
      return players[0];
    } else {
      return selectedPlayer;
    }
  }


  /**
   * Observes the players waiting for a category to be picked
   */
  private observe() {
    const subscription = this.state.state$.pipe(
      takeUntil(this.complete$),
      map(state => state.playerDisplay.category)
    ).subscribe(categoryState => {
      if (categoryState.done) {
        // Player picked a category
        this.log('Player picked category: ' + categoryState.playerResponse);
        // Updates the history
        this.history.addPicker(categoryState.playerUID);
        this.history.addCategory(categoryState.playerResponse);
        subscription.unsubscribe();
        this.complete(categoryState.playerResponse);
      } else {
        // Player has not picked a category yet
      }
    });
  }

  /**
   * Completes the category picking screen with the chosen category as a parameter
   * @param category The chosen category
   */
  private complete(category: string) {
    this.complete$.next(category);
  }

  /**
   * Logs to the console, prepending a file specific prefix
   * @param msg The message to log
   */
  private log(msg: string) {
    console.log('[Host][Category] ' + msg);
  }

}
