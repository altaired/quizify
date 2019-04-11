import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { timer } from 'rxjs';

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

  complete() {
    this.completed.next(true);
  }

}
