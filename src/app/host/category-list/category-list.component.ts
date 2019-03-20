import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';
import { GameHostService } from 'src/app/services/game-host.service';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { CategoryObj } from 'src/app/models/spotify';
import { CategoryState, CategoryOption } from 'src/app/models/state';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  categoryState$: Observable<CategoryState>;
  options$: Observable<CategoryOption[]>;

  constructor(private game: GameHostService) { }

  ngOnInit() {
    this.categoryState$ = this.game.state$.pipe(
      filter(state => state.playerDisplay ? true : false),
      map(state => state.playerDisplay.category),
      tap(console.log)
    );
    this.options$ = this.categoryState$.pipe(map(state => Object.values(state.options)));

  }

}
