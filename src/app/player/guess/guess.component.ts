import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Game } from 'src/app/models/state';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Service takning care of the authentication process of hosts and players
 * @author Simon Persson, Oskar Norinder
 */

@Component({
  selector: 'app-guess',
  templateUrl: './guess.component.html',
  styleUrls: ['./guess.component.scss']
})
export class GuessComponent implements OnInit {

  @Input() state: Game;
  @Output() answered: EventEmitter<string[]> = new EventEmitter();
  done = false;
  first: string;
  second: string;
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      answer: ''
    });
  }

  /**
   * Gets the accesToken for a given user
   * @param ans The users answer to the first question
   */

  selectFirstAnswer(ans) {
    console.log(ans);
    this.first = ans;
  }

    /**
   * Gets the accesToken for a given user
   *  The users answer to the first question
   */

  send() {
    this.done = true;
    this.second = this.formGroup.value.answer;
    this.answered.next([this.first, this.second, this.state.playerDisplay.question.id]);
  }

  convertOptions(state: Game) {
    return Object.values(state.playerDisplay.question.first.options);
  }

}
