import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-guess-artist',
  templateUrl: './guess-artist.component.html',
  styleUrls: ['./guess-artist.component.scss']
})
export class GuessArtistComponent implements OnInit {
  choices : Object[];
  constructor(private auth: AuthService) { }

  getChoices(){
    this.auth.getArtists().subscribe(choices => this.choices = choices);
  }



  ngOnInit() {
    this.getChoices();
  }

}
