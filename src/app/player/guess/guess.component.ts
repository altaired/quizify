import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Game } from 'src/app/models/state';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Component allowing the player to pick answers to the current questions and save them
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
   * Take the answer to the first question
   * @param ans The users answer to the first question
   */

  selectFirstAnswer(ans) {
    console.log(ans);
    this.first = ans;
  }

    /**
   * Send the input answers to the questions and set the player to done for this question
   */

  send() {
    this.done = true;
    this.second = this.formGroup.value.answer;
    this.answered.next([this.first, this.second, this.state.playerDisplay.question.id]);
  }
    /**
   * Gets only the values for the options for display them from an array
   * @param state The current game
   * @returns Array with the chosen options values
   */
  convertOptions(state: Game) {
    return Object.values(state.playerDisplay.question.first.options);
  }

}
