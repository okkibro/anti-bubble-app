import { TestBed } from '@angular/core/testing';

import { DataExchageService } from './data-exchage.service';

describe('DataExchageService', () => {
  let service: DataExchageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataExchageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
