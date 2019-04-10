import { Component, OnInit } from '@angular/core';
import { GameHostService } from 'src/app/services/game-host.service';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Player } from 'src/app/models/state';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  track$: Observable<any>
  players$: Observable<Player[]>;
  results: Observable<any>;

  constructor(private game: GameHostService){ }

  ngOnInit() {
    this.track$ = this.game.track$.pipe(filter(t => t))
    this.players$ = this.game.state$.pipe(
      filter(state => state.players ? true : false),
      map(state => Object.values(state.players))
    );


  }

}
