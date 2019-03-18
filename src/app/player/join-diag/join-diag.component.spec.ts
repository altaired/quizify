import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinDiagComponent } from './join-diag.component';

describe('JoinDiagComponent', () => {
  let component: JoinDiagComponent;
  let fixture: ComponentFixture<JoinDiagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinDiagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinDiagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
