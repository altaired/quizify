import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-guess-artist',
  templateUrl: './guess-artist.component.html',
  styleUrls: ['./guess-artist.component.scss']
})
export class GuessArtistComponent implements OnInit {

  @Input() options: Observable<Choice>;

  constructor(private auth: AuthService) { }

  ngOnInit() {

  }

}

export interface Choice {
  uri: string;
  displayValue: string;
}
