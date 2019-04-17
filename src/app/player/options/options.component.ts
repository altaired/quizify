import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Option } from 'src/app/models/state';
import { Observable } from 'rxjs';
/**
 * A generalized component that allows the display of multiple options of something as cards and the player can pick one
 * @author Simon Persson, Oskar Norinder
 */

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
    this.randomizedOptions = this.options.sort((a, b) => .5 - Math.random());
  }

/**
 * Sends on the selected option picked by the player
 * @param option Array with The option picked by the player
 */
  select(option: string) {
    this.selected.next(option);
  }

}
