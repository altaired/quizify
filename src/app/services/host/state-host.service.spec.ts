import { TestBed } from '@angular/core/testing';

import { StateHostService } from './state-host.service';

describe('StateHostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StateHostService = TestBed.get(StateHostService);
    expect(service).toBeTruthy();
  });
});
