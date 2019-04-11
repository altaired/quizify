import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { combineLatest, of, from } from 'rxjs';
import { take, map, filter, switchMap, share, finalize, last, tap } from 'rxjs/operators';
import { Player, Game, CategoryState } from '../models/state';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material';

/**
 * Handles the players state during the game
 * observes the total game state in firebase
 */

@Injectable({
  providedIn: 'root'
})
export class GamePlayerService {

  gameCode$ = new BehaviorSubject<string>(null);
  state$: Observable<Game>;
  displayName$: Observable<string>;
  isCategoryPicker$: Observable<boolean>;

  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) { }

  join(gameCode: string, name: string): Promise<Boolean> {
    const uGameCode = gameCode.toUpperCase();
    return new Promise<Boolean>((resolve, reject) => {
      combineLatest(
        this.auth.user$.pipe(take(1), map(user => user.uid)),
        this.db.object<Game>('games/' + uGameCode).valueChanges().pipe(take(1))
      ).pipe(take(1)).subscribe(([uid, game]) => {
        if (game && game.state === 'WELCOME') {
          // Game is still in WELCOME mode => Players can join the game
          if (!game.players) {
            this.log('First player joined the game');
            // First player to join
            this.addPlayer({ displayName: name, uid: uid }, uGameCode);
            resolve(true);
          } else if (Object.values(game.players).every(player => player.uid !== uid)) {
            // There are players in game, check for duplicates
            this.log('Joining game');
            this.addPlayer({ displayName: name, uid: uid }, uGameCode);
            resolve(true);
          } else {
            console.error('Player already in game');
            reject('Player already in game');
          }
        } else {
          console.error('Game not available');

          reject('Game not available');
        }
      });
    });
  }

  reconnect(): boolean {
    const code = window.localStorage.getItem('game_code');
    if (code !== '') {
      this.initGame(code);
      return true;
    } else {
      return false;
    }
  }

  private addPlayer(player: Player, gameCode: string) {
    this.log('Adding player to game with code ' + gameCode);
    this.db.list('games/' + gameCode + '/players').push(player);
    this.initGame(gameCode);
  }

  private initGame(gameCode: string) {
    window.localStorage.setItem('game_code', gameCode);
    this.gameCode$.next(gameCode);
    this.state$ = this.gameCode$
      .pipe(
        switchMap(code => this.db.object<Game>('games/' + code).valueChanges().pipe(share()))
      );
    // Getting the players display name
    this.displayName$ = combineLatest(this.auth.user$, this.state$).pipe(map(([user, state]) => {
      return Object.values(state.players).find(p => p.uid === user.uid).displayName;
    }));

    // Checks if the player is set to be the category picker
    this.isCategoryPicker$ = combineLatest(this.state$, this.auth.user$)
      .pipe(map(([state, user]) => {
        if (state.playerDisplay) {
          return state.playerDisplay.category.playerUID === user.uid;
        } else {
          return false;
        }
      }));
  }

  pickCategory(option: string) {
    const code = this.gameCode$.getValue();
    this.isCategoryPicker$.pipe(take(1)).subscribe(picker => {
      if (picker) {
        this.db.object<CategoryState>('games/' + code + '/playerDisplay/category').update({
          playerResponse: option,
          done: true
        });
        console.log('Category set, waiting for host...');
      } else {
        console.error('Player not set to pick category');
      }
    });
  }
  respond(first: string, second: string, question: string) {
    combineLatest(this.auth.user$, this.gameCode$).pipe(
      take(1),
      switchMap(([user, code]) => {
        return combineLatest(
          of(code),
          this.db.list(
            'games/' + code + '/players',
            ref => ref.orderByChild('uid').equalTo(user.uid)).snapshotChanges()
        );
      }),
      take(1)
    ).subscribe(([code, snapshot]) => {
      if (snapshot.length > 0) {
        const key = snapshot[0].key;
        this.db.object('games/' + code + '/players/' + key).update({
          response: {
            done: true,
            first: first,
            second: second,
            question: question
          }
        });
        console.log('Answer sent');
      }
    });
  }

  startGame() {
    // Starts the game by letting the host know that we're ready
    const code = this.gameCode$.getValue();
    this.db.object('games/' + code + '/admin').update({ ready: true });
  }

  setAvatar(dataURL: string) {
    console.log('Uploading avatar...');
    combineLatest(this.auth.user$, this.gameCode$).pipe(
      take(1),
      switchMap(([user, code]) => {
        const filePath = `avatars/${code}/${user.uid}/avatar.jpg`;
        const refPath = this.storage.ref(filePath);
        const task = refPath.putString(dataURL, 'data_url', { contentType: 'image/jpeg' });
        const downloadURL = task.snapshotChanges().pipe(
          last(),
          switchMap(() => {
            const url = refPath.getDownloadURL();
            console.log('download url is ', url);
            return url;
          })
        );
        return combineLatest(
          of(code),
          this.db.list(
            'games/' + code + '/players',
            ref => ref.orderByChild('uid').equalTo(user.uid)).snapshotChanges(),
          downloadURL);
      }),
      take(1)
    ).subscribe(([code, snapshot, url]) => {
      if (snapshot.length > 0) {
        const key = snapshot[0].key;
        console.log('URL', url);
        this.db.object('games/' + code + '/players/' + key).update({ avatar: url });
        console.log('Updated avatar');
      }
    });
  }

  /**
   * Logs to the console, prepending a file specific prefix
   * @param msg The message to log
   */
  private log(msg: string) {
    console.log('[Player][Game] ' + msg);
  }

}
