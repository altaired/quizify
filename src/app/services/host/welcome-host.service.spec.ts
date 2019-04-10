import { TestBed } from '@angular/core/testing';

import { WelcomeHostService } from './welcome-host.service';

describe('WelcomeHostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WelcomeHostService = TestBed.get(WelcomeHostService);
    expect(service).toBeTruthy();
  });
});
