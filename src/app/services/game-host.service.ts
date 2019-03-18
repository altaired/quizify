import { Injectable } from '@angular/core';
import { Game, GameMode, Admin } from '../models/state';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';

/**
 * Takes care of the hosts state which is
 * observed by the players.
 */

@Injectable({
  providedIn: 'root'
})
export class GameHostService {

  private gameCode$ = new BehaviorSubject<string>(null);
  private state$: Observable<Game>;

  constructor(private db: AngularFireDatabase) { }

  newGame(gameCode: string, gameMode: GameMode) {
    const game: Game = {
      gameMode: gameMode,
      state: 'WELCOME',
      players: []
    };
    this.gameCode$.next(gameCode);
    this.db.object('games/' + gameCode).set(game);
    this.state$ = this.db.object<Game>('games/' + gameCode).valueChanges();
    this.welcomeHandler();
  }

  private welcomeHandler() {
    const playersSubscription = this.state$.pipe(
      map(state => state.players)
    ).subscribe(players => {
      if (players.length === 1) {
        this.setGameAdmin(players[0].uid);
      }
    });
  }

  private setGameAdmin(uid: string) {
    this.gameCode$.subscribe(code => {
      this.db.object('games/' + code).update({
        admin: {
          playerUID: uid,
          ready: false
        }
      });
      this.activateReadyObserver();
    });
  }

  private activateReadyObserver() {
    this.state$.pipe(
      filter(state => state.admin ? true : false),
      map(state => state.admin.ready),
      filter(ready => ready),
      take(1)
    ).subscribe(ready => {
      console.log('Admin is ready, starting game');
    });
  }
}
