import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Option } from 'src/app/models/state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  @Input() options: any[];
  @Output() selected: EventEmitter<string> = new EventEmitter();
  randomizedOptions: any[];

  constructor() {

  }

  ngOnInit() {
    console.log(this.options);
    this.randomizedOptions = this.options.sort((a, b) => .5 - Math.random());
  }


  select(option: string) {
    this.selected.next(option);
  }

}
