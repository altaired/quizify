import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Player } from 'src/app/models/state';
import { StateHostService } from 'src/app/services/host/state-host.service';
import { QuestionHostService } from 'src/app/services/host/question-host.service';

/**
 * Service takning care of the authentication process of hosts and players
 * @author Simon Persson, Oskar Norinder
 */

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  track$: Observable<any>
  players$: Observable<Player[]>;
  results$: Observable<any>;

  constructor(
    private state: StateHostService,
    private question: QuestionHostService
  ) {
    this.track$ = this.question.track$.pipe(filter(t => t));
    this.results$ = this.question.result$.pipe(
      filter(res => res ? true : false),
      filter(res => {
        return (res.length > 0 && res[0].question === this.question.track$.getValue().track.id);
      }));
    this.players$ = this.state.state$.pipe(
      filter(st => st.state ? true : false),
      map(st => Object.values(st.players))
    );
  }

  ngOnInit() {

  }
  /**
   * Gets the accesToken for a given user
   * @param player Player in the game
   * @param result array with all players responses on the last asked question
   * @returns this specific players result
   */
  getPlayerResult(player: Player, results: any[]) {
    return results.find(r => r.id === player.uid);
  }

}
