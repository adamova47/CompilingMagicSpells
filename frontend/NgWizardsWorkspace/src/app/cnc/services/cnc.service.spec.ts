import { TestBed } from '@angular/core/testing';

import { CncService } from './cnc.service';

describe('CncService', () => {
  let service: CncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
