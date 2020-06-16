import { TestBed } from '@angular/core/testing';

import { LabyrinthGuardService } from './labyrinth-guard.service';

describe('LabyrinthGuardService', () => {
  let service: LabyrinthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabyrinthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
