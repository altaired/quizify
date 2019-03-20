import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { combineLatest } from 'rxjs';
import { take, map, filter, switchMap } from 'rxjs/operators';
import { Player, Game } from '../models/state';
import { unescapeIdentifier } from '@angular/compiler';
import { reject } from 'q';

/**
 * Handles the players state during the game
 * observes the total game state in firebase
 */

@Injectable({
  providedIn: 'root'
})
export class GamePlayerService {

  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase
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
            this.addPlayerToGame({ displayName: name, uid: uid }, gameCode);
            resolve(true);
          } else if (Object.values(game.players).every(player => player.uid !== uid)) {
            this.addPlayerToGame({ displayName: name, uid: uid }, gameCode);
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

  private addPlayerToGame(player: Player, gameCode: string) {
    this.db.list('games/' + gameCode + '/players').push(player);
  }

}
