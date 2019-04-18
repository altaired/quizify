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
import { ErrorSnackService } from '../error-snack.service';

/**
 * Takes care of the general game for the host, deciding which screen to show a.s.o
 * @author Simon Persson, Oskar Norinder
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
    private state: StateHostService,
    private errorSnack: ErrorSnackService,
  ) {
    // Listens for the screens completion emitters
    this.welcome.complete$.subscribe(res => this.welcomeComplete());
    this.category.complete$.subscribe(res => this.categoryComplete(res));
    this.question.complete$.subscribe(res => this.questionComplete());
  }

  /**
   * Generates a hash to be used as a game code.
   * Needs improvement with a more unique hash, since it's
   * currently based on the timestamp
   * @returns An `Observable` of the hashed string
   */
  private get hash(): Observable<string> {
    return this.auth.user$.pipe(
      take(1),
      map(user => {
        const dateHash = new Date().valueOf();
        return this.hasher.encode(dateHash);
      })
    );
  }

  /**
   * Creates a new game and sets the state to `WELCOME`
   * @param gameMode The game mode beeing played, currently only 'STANDARD' is supported
   */
  newGame(gameMode: GameMode) {
    this.hash.pipe(take(1)).subscribe(gameCode => {
      this.log('Game created with code ' + gameCode);
      const game: Game = {
        gameMode: gameMode,
        state: 'WELCOME'
      };
      this.db.object('games/' + gameCode).set(game).catch(error => this.errorSnack.onError('Firebase could not create new Game'))
      this.state.setCode(gameCode);
      this.start();
    });
  }


  /**
   * Removes the current game from firestore
   */
  delete() {
    this.state.code$.pipe(take(1)).subscribe(code => {
      this.db.object(`games/${code}`).remove().catch(error => this.errorSnack.onError('Firebase could not remove the Game'));
    })
  }

  /**
   * Clears the history and restarts the game,
   * this to let the players continue the game
   */
  continue() {
    this.history.resetRounds();
    this.category.start();
  }

  /**
   * Starts the game
   */
  private start() {
    this.router.navigate(['display']);
    this.welcome.start();
  }

  /**
   * Triggerd when the welcome screen is complete
   * Changes the state to intro
   */
  private welcomeComplete() {
    this.log('Starting intro...');
    this.state.changeState('INTRO');
  }

  /**
   * Triggerd when the intro screen is complete
   * Starts the category picking
   */
  introComplete() {
    this.log('Intro complete');
    this.history.introduced = true;
    this.category.start();
  }

  /**
   * Triggerd when the category screen is complete
   * Starts the question
   */
  private categoryComplete(category: string) {
    this.log('Category picking complete');
    this.question.start(category);
  }

  /**
   * Triggerd when the question and result screen is complete
   * Starts the next question or ends the game if it's finished
   */
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


