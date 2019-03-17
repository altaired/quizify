import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessTrackComponent } from './guess-track.component';

describe('GuessTrackComponent', () => {
  let component: GuessTrackComponent;
  let fixture: ComponentFixture<GuessTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuessTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuessTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
