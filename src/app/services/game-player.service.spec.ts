import { TestBed, inject } from '@angular/core/testing';

import { GamePlayerService } from './game-player.service';

describe('GamePlayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GamePlayerService]
    });
  });

  it('should be created', inject([GamePlayerService], (service: GamePlayerService) => {
    expect(service).toBeTruthy();
  }));
});
