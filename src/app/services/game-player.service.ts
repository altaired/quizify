import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { take, map } from 'rxjs/operators';
import { Player } from '../models/state';
import { unescapeIdentifier } from '@angular/compiler';

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
    this.auth.user$.pipe(take(1), map(user => user.uid))
      .subscribe(uid => this.db.list('games/' + gameCode + '/players').push(({
        uid: uid,
        displayName: name
      })));
  }
}
