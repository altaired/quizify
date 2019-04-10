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

@Injectable({
  providedIn: 'root'
})
export class CategoryHostService {

  complete$ = new Subject<string>();

  constructor(
    private spotify: SpotifyService,
    private history: HistoryHostService,
    private db: AngularFireDatabase,
    private state: StateHostService
  ) { }

  start() {

    combineLatest(this.spotify.listCategories().pipe(
      map(res => {
        const categories = res.categories.items;
        const allowed = categories.filter(c => CATEGORY_WHITELIST.some(id => c.id === id));
        const shuffled = allowed.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6);
        return selected;
      })
    ),
      this.state.players$
    ).pipe(take(1))
      .subscribe(([categories, players]) => {
        console.log('[GameHost] Initializing category picking...');
        this.startPickCategory(categories, players);
      });
  }

  private startPickCategory(categories, players: Player[]) {
    const code = this.state.code$.getValue();
    const options = categories.map(category => {
      const categoryObj: Option = {
        id: category.id,
        value: category.name,
        image: category.icons[0]
      };
      return categoryObj;
    });
    let selectedPlayer = players.find(player =>
      this.history.validatePicker(player.uid)
    );
    if (!selectedPlayer) {
      selectedPlayer = players[0];
    }
    const categoryState: CategoryState = {
      playerUID: selectedPlayer.uid,
      done: false,
      options: options
    };
    this.db.object('games/' + code + '/playerDisplay/category').set(categoryState);
    this.state.changeState('PICK_CATEGORY');
    this.activateCategoryObserver();
    console.log('[GameHost] Waiting for player to pick a category');
  }


  private activateCategoryObserver() {
    const subscription = this.state.state$.pipe(
      takeUntil(this.complete$),
      map(state => state.playerDisplay.category)
    ).subscribe(categoryState => {
      if (categoryState.done) {
        // Player picked a category
        console.log('[GameHost] Player picked category: ' + categoryState.playerResponse);
        // Updates the history
        this.history.addPicker(categoryState.playerUID);
        this.history.addCategory(categoryState.playerResponse);
        subscription.unsubscribe();
        this.complete(categoryState.playerResponse);
      } else {
        // Player have not picked a category yet
      }
    });
  }

  private complete(category: string) {
    this.complete$.next(category);
  }
}
