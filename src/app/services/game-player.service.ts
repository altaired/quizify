import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { combineLatest, of } from 'rxjs';
import { take, map, filter, switchMap, share } from 'rxjs/operators';
import { Player, Game } from '../models/state';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { userInfo } from 'os';
import { stringify } from '@angular/core/src/render3/util';

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

  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) { }

  join(gameCode: string, name: string) {
    return new Promise<Boolean>((resolve, reject) => {
      combineLatest(
        this.auth.user$.pipe(take(1), map(user => user.uid)),
        this.db.object<Game>('games/' + gameCode).valueChanges().pipe(take(1))
      ).pipe(take(1)).subscribe(([uid, game]) => {
        if (game && game.state === 'WELCOME') {
          console.log(game.players);
          if (!game.players) {
            this.initGame({ displayName: name, uid: uid }, gameCode);
            resolve(true);
          } else if (Object.values(game.players).every(player => player.uid !== uid)) {
            this.initGame({ displayName: name, uid: uid }, gameCode);
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

  private initGame(player: Player, gameCode: string) {
    this.db.list('games/' + gameCode + '/players').push(player);
    this.gameCode$.next(gameCode);
    this.state$ = this.gameCode$
      .pipe(
        switchMap(code => this.db.object<Game>('games/' + code).valueChanges().pipe(share()))
      );
    this.displayName$ = combineLatest(this.auth.user$, this.state$).pipe(map(([user, state]) => {
      return Object.values(state.players).find(p => p.uid === user.uid).displayName;
    }));
  }

  startGame() {
    const code = this.gameCode$.getValue();
    this.db.object('games/' + code + '/admin').update({ ready: true });
  }

  setAvatar(dataURL: string) {
    
    combineLatest(this.auth.user$, this.gameCode$).pipe(
      take(1), 
      switchMap(([user, code]) => {
        const filePath = `avatars/${code}/${user.uid}/avatar`;
        const refPath = this.storage.ref(filePath);
        const task = refPath.putString(dataURL);
      
        return combineLatest(
          of(code),
          this.db.list(
            'games/' + code + '/players', 
            ref => ref.orderByChild('uid').equalTo(user.uid)).snapshotChanges(), 
          refPath.getDownloadURL());
      })
    ).pipe(take(1)).subscribe(([code, snapshot, url]) => {
      if (snapshot.length > 0) {
        const key = snapshot[0].key;
        this.db.object('games/' + code + '/players/' + key).update({avatarURL: url});
        console.log('Updated avatar');
      }
    });
  }

}
