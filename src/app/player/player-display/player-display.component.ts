import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GamePlayerService } from 'src/app/services/game-player.service';
import { Observable, combineLatest } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { Game } from '../../models/state';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-player-display',
  templateUrl: './player-display.component.html',
  styleUrls: ['./player-display.component.scss']
})
export class PlayerDisplayComponent implements OnInit {

  displayName$: Observable<string>;
  adminUID$: Observable<string>;
  state$: Observable<Game>;

  isCategoryPicker$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private game: GamePlayerService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.state$ = this.game.state$;
    this.displayName$ = this.game.displayName$;
    this.adminUID$ = this.state$.pipe(
      filter(state => state.admin ? true : false),
      map(state => state.admin.playerUID)
    );
    this.isCategoryPicker$ = this.game.isCategoryPicker$;
  }

  startGame() {
    this.game.startGame();
  }

  selectCategory(option: string) {
    console.log('Category picked', option);
    this.game.pickCategory(option);
  }

  respond(evt: string[]) {
    this.game.respond(evt[0], evt[1], evt[2]);
  }

  convertCategories(state: Game) {
    return Object.values(state.playerDisplay.category.options);
  }

}
