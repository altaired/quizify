import { Injectable } from '@angular/core';
import { Game, GameMode, Player, GameState, CategoryOption, CategoryState } from '../models/state';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, switchMap, filter, takeUntil, share, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Hash } from 'src/app/utils/hash';
import { AuthService } from './auth.service';
import { History } from '../models/history';
import { SpotifyService } from './spotify.service';

/**
 * Takes care of the hosts state which is
 * observed by the players.
 */

@Injectable({
  providedIn: 'root'
})
export class GameHostService {

  private hasher = new Hash('INTERACTIONPROGRAMMING', 4, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789');

  gameCode$ = new BehaviorSubject<string>(null);
  state$: Observable<Game>;
  private history: History;

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService,
    private spotify: SpotifyService,
    private router: Router
  ) {
    this.history = {
      tracks: [],
      categories: [],
      pickers: []
    };
  }

  private get hash(): Observable<string> {
    return this.auth.user$.pipe(
      take(1),
      map(user => {
        const dateHash = new Date().valueOf();
        return this.hasher.encode(dateHash);
      })
    );
  }

  newGame(gameMode: GameMode) {
    this.hash.pipe(take(1)).subscribe(gameCode => {
      console.log('Game code', gameCode);
      const game: Game = {
        gameMode: gameMode,
        state: 'WELCOME'
      };
      this.db.object('games/' + gameCode).set(game);
      this.gameCode$.next(gameCode);
      this.state$ = this.gameCode$
        .pipe(
          switchMap(code => this.db.object<Game>('games/' + code).valueChanges().pipe(share()))
        );
      this.welcomeHandler();
    });

  }

  get players$(): Observable<Player[]> {
    return this.state$.pipe(
      filter(state => state.players ? true : false),
      map(state => Object.values(state.players)),
    );
  }


  private welcomeHandler() {
    this.router.navigate(['display']);
    const subscription = this.state$.pipe(
      filter(state => state.players ? true : false),
      map(state => Object.values(state.players)),
    ).subscribe(players => {
      if (players.length === 1) {
        this.setGameAdmin(players[0].uid);
        subscription.unsubscribe();
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
    combineLatest(this.spotify.listCategories().pipe(
      map(res => {
        const categories = res.categories.items;
        const shuffled = categories.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6);
        return selected;
      })
    ), this.players$).subscribe(([categories, players]) => {
      const code = this.gameCode$.getValue();
      const options = categories.map(category => {
        const categoryObj: CategoryOption = {
          id: category.id,
          name: category.name,
          image: category.icons[0]
        };
        return categoryObj;
      });
      const selectedPlayer = players.find(player =>
        !this.history.pickers.some(picker => picker === player.uid)
      );
      const categoryState: CategoryState = {
        playerUID: selectedPlayer.uid,
        done: false,
        options: options
      };
      this.db.object('games/' + code + '/playerDisplay/category').set(categoryState);
      this.setState('PICK_CATEGORY');
    });
  }

  private setState(state: GameState) {
    this.gameCode$.pipe(take(1)).subscribe(code => {
      this.db.object('games/' + code).update({ state: state });
    });
  }

}
