import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessOptionComponent } from './guess-option.component';

describe('GuessOptionComponent', () => {
  let component: GuessOptionComponent;
  let fixture: ComponentFixture<GuessOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuessOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuessOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
