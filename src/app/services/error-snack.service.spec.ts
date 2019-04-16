import { TestBed } from '@angular/core/testing';

import { ErrorSnackService } from './error-snack.service';

describe('ErrorSnackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErrorSnackService = TestBed.get(ErrorSnackService);
    expect(service).toBeTruthy();
  });
});
