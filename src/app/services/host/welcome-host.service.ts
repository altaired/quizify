import { Injectable } from '@angular/core';
import { GameHostService } from './game-host.service';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeWhile } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { Game } from 'src/app/models/state';
import { StateHostService } from './state-host.service';

@Injectable({
  providedIn: 'root'
})
export class WelcomeHostService {

  complete$ = new Subject<string>();


  constructor(
    private db: AngularFireDatabase,
    private state: StateHostService
  ) { }

  start() {
    this.startWelcome();
  }

  private startWelcome() {

    const subscription = this.state.state$.pipe(
      filter(state => state.players ? true : false),
      map(state => Object.values(state.players)),
    ).subscribe(players => {
      if (players.length === 1) {
        this.setGameAdmin(players[0].uid);
        subscription.unsubscribe();
      }
      console.log('[GameHost] Players', players);
    });
  }

  private setGameAdmin(uid: string) {
    this.state.code$.subscribe(code => {
      this.db.object('games/' + code).update({
        admin: {
          playerUID: uid,
          ready: false
        }
      });
      console.log('[GameHost] Admin player updated to ' + uid);
      this.activateWelcomeObserver();
    });
  }

  private activateWelcomeObserver() {
    this.state.state$.pipe(
      takeWhile(s => s.state === 'WELCOME'),
      filter(s => s.admin ? true : false),
      map(s => s.admin.ready),
      filter(ready => ready)
    ).subscribe(ready => {
      console.log('[GameHost] Admin is ready');
      this.complete();
    });
  }

  private complete() {
    this.complete$.next('');
  }


}
