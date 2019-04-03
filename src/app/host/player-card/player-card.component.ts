import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../models/state';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})
export class PlayerCardComponent implements OnInit {
  @Input() player: Player;
  @Input() isAdmin = false ;
  @Input() isDone = false ;
  constructor() { }

  ngOnInit() {
  }

}

