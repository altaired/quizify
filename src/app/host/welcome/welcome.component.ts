import { Component, OnInit, Input } from '@angular/core';
import { Game, Player } from '../../models/state';
import { take, map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  joinPath$: Observable<string>;
  @Input() adminUID$: Observable<string>;
  @Input() players$: Observable<Player[]>;
  @Input() gameCode$: Observable<string>;

  playerDetails$: Observable<PlayerDetails[]>;

  constructor(private route: ActivatedRoute,) { }

  ngOnInit() {
    this.joinPath$ = this.gameCode$.pipe(map(code => `${window.location.host}/?code=${code}`));
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
