import { Component, OnInit, Input } from '@angular/core';
import { Game, Player } from '../models/state';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  @Input() players$: Observable<Player[]>;
  @Input() gameCode$: Observable<string>;

  constructor() { }
  ngOnInit() {

  }



}
