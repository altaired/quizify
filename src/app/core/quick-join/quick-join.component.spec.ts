import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickJoinComponent } from './quick-join.component';

describe('QuickJoinComponent', () => {
  let component: QuickJoinComponent;
  let fixture: ComponentFixture<QuickJoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickJoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
