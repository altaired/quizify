import { TestBed } from '@angular/core/testing';

import { QuestionHostService } from './question-host.service';

describe('QuestionHostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionHostService = TestBed.get(QuestionHostService);
    expect(service).toBeTruthy();
  });
});
