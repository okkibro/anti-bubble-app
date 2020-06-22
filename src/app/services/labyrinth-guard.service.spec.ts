/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

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
