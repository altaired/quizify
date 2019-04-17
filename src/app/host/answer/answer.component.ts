import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from 'src/app/models/state';
/**
 * Component showing which people have answered and how much time they have left to answer
 * @author Simon Persson, Oskar Norinder
 */
@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {

  @Input() timer$: Observable<number>;
  @Input() players$: Observable<Player[]>;

  constructor() { }

  ngOnInit() {
  }

}
