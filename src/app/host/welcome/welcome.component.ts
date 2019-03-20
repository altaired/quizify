import { Component, OnInit, Input } from '@angular/core';
import { Game, Player } from '../../models/state';
import { take, map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  @Input() adminUID$: Observable<string>;
  @Input() players$: Observable<Player[]>;
  @Input() gameCode$: Observable<string>;

  playerDetails$: Observable<PlayerDetails[]>;

  constructor() { }
  ngOnInit() {
    this.playerDetails$ = combineLatest(this.players$, this.adminUID$)
      .pipe(map(([players, admin]) => {
        return players.map(player => {
          return {
            player: player,
            isAdmin: player.uid === admin
          };
        });
      }));
  }



}

interface PlayerDetails {
  player: Player;
  isAdmin: boolean;
}
