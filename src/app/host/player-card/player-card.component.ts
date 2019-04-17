import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../models/state';
/**
 * Component that is a card which holds the players avatar and name and if they are done
 * @author Simon Persson, Oskar Norinder
 */
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

