import { Injectable } from '@angular/core';
import { Game, GameMode, Admin, GameState, Player } from '../models/state';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, filter, takeUntil } from 'rxjs/operators';

/**
 * Takes care of the hosts state which is
 * observed by the players.
 */

@Injectable({
  providedIn: 'root'
})
export class GameHostService {
  private gameCode$ = new BehaviorSubject<string>(null);
   state$: Observable<Game>;

  constructor(private db: AngularFireDatabase) { }

  newGame(gameCode: string, gameMode: GameMode) {
    const game: Game = {
      gameMode: gameMode,
      state: 'WELCOME'
    };
    this.gameCode$.next(gameCode);
    this.db.object('games/').remove();
    this.db.object('games/' + gameCode).set(game);
    this.state$ = this.db.object<Game>('games/' + gameCode).valueChanges();
    this.welcomeHandler();
  }

  getPlayers(): Observable<Player[]>{
    return this.state$.pipe(
      filter(state => state.players ? true : false),
      map(state => Object.values(state.players)),
    );
  }

  getGameState(): Observable<GameState>{
    return this.db.object<GameState>('games/' + this.gameCode$+ '/state').valueChanges()
  }

  getGameCode(): Observable<string>{
    return this.gameCode$.asObservable().pipe(take(1));
  }



  private welcomeHandler() {
    const playersSubscription = this.state$.pipe(
      filter(state => state.players ? true : false),
      map(state => Object.values(state.players)),
    ).subscribe(players => {
      if (players.length === 1) {
        this.setGameAdmin(players[0].uid);
      }
      console.log('Players', players);
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
      console.log('Admin set', uid);
      this.activateReadyObserver();
    });
  }

  private activateReadyObserver() {
    this.state$.pipe(
      takeUntil(this.state$.pipe(filter(state => state.state !== 'WELCOME'))),
      filter(state => state.admin ? true : false),
      map(state => state.admin.ready),
      filter(ready => ready),
    ).subscribe(ready => {
      console.log('Admin is ready, starting game');
      this.startGame();
    });
  }

  private startGame() {

  }

}
