import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessTextComponent } from './guess-text.component';

describe('GuessTextComponent', () => {
  let component: GuessTextComponent;
  let fixture: ComponentFixture<GuessTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuessTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuessTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
