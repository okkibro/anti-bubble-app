import { TestBed } from '@angular/core/testing';

import { DataService } from './data-exchange.service';

describe('DataExchageService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });
});
