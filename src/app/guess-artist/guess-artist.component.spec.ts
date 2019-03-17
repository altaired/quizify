import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessArtistComponent } from './guess-artist.component';

describe('GuessArtistComponent', () => {
  let component: GuessArtistComponent;
  let fixture: ComponentFixture<GuessArtistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuessArtistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuessArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
