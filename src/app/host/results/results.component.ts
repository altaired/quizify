import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Player } from 'src/app/models/state';
import { StateHostService } from 'src/app/services/host/state-host.service';
import { QuestionHostService } from 'src/app/services/host/question-host.service';

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
    ){ 
      this.results$ = this.question.result$;
    }

  ngOnInit() {
    this.track$ = this.question.track$.pipe(filter(t => t))
    this.players$ = this.state.state$.pipe(
      filter(state => state.state ? true : false),
      map(state => Object.values(state.players))
    );
  }

  getPlayerResult(player: Player, results: any[]) {
    return results.find(r => r.id === player.uid);
  }

}
