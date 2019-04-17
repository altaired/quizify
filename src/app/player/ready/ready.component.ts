import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
/**
 * Display component for players the save their avatar and the Admin to save their avatar and start the game
 * @author Simon Persson, Oskar Norinder
 */
@Component({
  selector: 'app-ready',
  templateUrl: './ready.component.html',
  styleUrls: ['./ready.component.scss']
})
export class ReadyComponent implements OnInit {

  @Input() adminUID$: Observable<string>;
  @Output() ready: EventEmitter<any> = new EventEmitter();
  isAdmin$: Observable<boolean>;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.isAdmin$ = combineLatest(this.auth.user$, this.adminUID$)
      .pipe(map(([user, admin]) => {
        return user.uid === admin;
      }));
  }
/**
 * If admin can trigger to start the game
 */
  start() {
    this.ready.emit();
  }

}
