import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { timer } from 'rxjs';

/**
 * Component showing how to play the game for a set ammount of time.
 * @author Simon Persson, Oskar Norinder
 */
@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {

  @Output() completed: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    timer(15000).subscribe(() => this.complete());
  }
  /**
   * Continue with the game when the intro has been shown for the set ammount of time
   */
  complete() {
    this.completed.next(true);
  }

}
