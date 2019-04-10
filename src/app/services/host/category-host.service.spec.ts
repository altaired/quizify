import { TestBed } from '@angular/core/testing';

import { CategoryHostService } from '../category-host.service';

describe('CategoryHostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategoryHostService = TestBed.get(CategoryHostService);
    expect(service).toBeTruthy();
  });
});
