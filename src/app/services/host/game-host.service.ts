import { Injectable } from '@angular/core';
import { Game, GameMode, Player, GameState, Option, CategoryState } from '../../models/state';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable, combineLatest, of, timer, interval, merge } from 'rxjs';
import { map, switchMap, filter, takeUntil, share, take, takeWhile, tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Hash } from 'src/app/utils/hash';
import { AuthService } from '../auth.service';
import { HistoryHostService } from './history-host.service';
import { CategoryHostService } from './category-host.service';
import { QuestionHostService } from './question-host.service';
import { WelcomeHostService } from './welcome-host.service';
import { StateHostService } from './state-host.service';

/**
 * Takes care of the hosts state which is
 * observed by the players.
 */

@Injectable({
  providedIn: 'root'
})
export class GameHostService {

  private hasher = new Hash('QUIZIFY', 6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789');


  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService,
    private router: Router,
    private history: HistoryHostService,
    private category: CategoryHostService,
    private question: QuestionHostService,
    private welcome: WelcomeHostService,
    private state: StateHostService
  ) {

    this.welcome.complete$.subscribe(res => this.welcomeComplete());
    this.category.complete$.subscribe(res => this.categoryComplete(res));
    this.question.complete$.subscribe(res => this.questionComplete());
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
      this.log('Game created with code ' + gameCode);
      const game: Game = {
        gameMode: gameMode,
        state: 'WELCOME'
      };
      this.db.object('games/' + gameCode).set(game);
      this.state.setCode(gameCode);
      this.start();
    });
  }

  private start() {
    this.router.navigate(['display']);
    this.welcome.start();
  }

  private welcomeComplete() {
    this.log('Starting intro...');
    this.state.changeState('INTRO');
  }

  introComplete() {
    this.log('Intro complete');
    this.history.introduced = true;
    this.category.start();
  }

  private categoryComplete(category: string) {
    this.log('Category picking complete');
    this.question.start(category);
  }

  private questionComplete() {
    this.log('Question complete');
    this.history.addGame();
    if (!this.history.finished) {
      this.log('Stating a new game sequence...');
      this.category.start();
    } else {
      this.state.changeState('END');
      this.log('Game finished');
    }
  }

  /**
   * Logs to the console, prepending a file specific prefix
   * @param msg The message to log
   */
  private log(msg: string) {
    console.log('[Host][Game] ' + msg);
  }




}


