import { TestBed } from '@angular/core/testing';

import { HistoryHostService } from './history-host.service';

describe('HistoryHostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoryHostService = TestBed.get(HistoryHostService);
    expect(service).toBeTruthy();
  });
});
