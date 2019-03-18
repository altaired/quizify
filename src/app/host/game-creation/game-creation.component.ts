import { Component, OnInit } from '@angular/core';
import { GameHostService } from 'src/app/services/game-host.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-creation',
  templateUrl: './game-creation.component.html',
  styleUrls: ['./game-creation.component.scss']
})
export class GameCreationComponent implements OnInit {
  
  constructor(private game: GameHostService,private router: Router) { }

  ngOnInit() {
  }
  createStandard(){
    this.router.navigate(['/display'])
    //this.game.newGame('AAAB', 'STANDARD');

  }
  createPassive(){
    console.log("sorry not done yet")
  }
}
