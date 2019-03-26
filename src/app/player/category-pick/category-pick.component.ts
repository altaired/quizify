import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Game, CategoryOption } from 'src/app/models/state';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-category-pick',
  templateUrl: './category-pick.component.html',
  styleUrls: ['./category-pick.component.scss']
})
export class CategoryPickComponent implements OnInit {

  @Input() state: Game;
  @Output() selected: EventEmitter<string> = new EventEmitter();

  categoryOptions$: Observable<CategoryOption[]>;

  constructor() {
  }

  ngOnInit() {
  }

  get options(): CategoryOption[] {
    return Object.values(this.state.playerDisplay.category.options)
  }

  select(option: CategoryOption) {
    this.selected.next(option.id);
  }

}
