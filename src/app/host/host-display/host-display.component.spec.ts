import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostDisplayComponent } from './host-display.component';

describe('DisplayComponent', () => {
  let component: HostDisplayComponent;
  let fixture: ComponentFixture<HostDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HostDisplayComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
