import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Game, Option } from 'src/app/models/state';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  @Input() options: any[];
  @Output() selected: EventEmitter<string> = new EventEmitter();

  categoryOptions$: Observable<Option[]>;

  constructor() {
  }

  ngOnInit() {
  }


  select(option: string) {
    this.selected.next(option);
  }

}
