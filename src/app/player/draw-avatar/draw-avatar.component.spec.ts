import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawAvatarComponent } from './draw-avatar.component';

describe('DrawAvatarComponent', () => {
  let component: DrawAvatarComponent;
  let fixture: ComponentFixture<DrawAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
