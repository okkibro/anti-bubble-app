import { TestBed } from '@angular/core/testing';

import { MilestoneUpdatesService } from './milestone-updates.service';

describe('MilestoneUpdatesService', () => {
  let service: MilestoneUpdatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MilestoneUpdatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
