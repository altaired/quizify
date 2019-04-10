import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';
import { GameHostService } from 'src/app/services/host/game-host.service';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { CategoryObj } from 'src/app/models/spotify';
import { CategoryState, Option } from 'src/app/models/state';
import { StateHostService } from 'src/app/services/host/state-host.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  categoryState$: Observable<CategoryState>;
  options$: Observable<Option[]>;

  constructor(private state: StateHostService) { }

  ngOnInit() {
    this.categoryState$ = this.state.state$.pipe(
      filter(state => state.playerDisplay ? true : false),
      map(state => state.playerDisplay.category)
    );
    this.options$ = this.categoryState$.pipe(map(state => Object.values(state.options)));

  }

}
