import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickDeviceComponent } from './pick-device.component';

describe('PickDeviceComponent', () => {
  let component: PickDeviceComponent;
  let fixture: ComponentFixture<PickDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
