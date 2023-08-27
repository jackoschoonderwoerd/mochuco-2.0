import { TestBed } from '@angular/core/testing';

import { LscService } from './lsc.service';

describe('LscService', () => {
  let service: LscService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LscService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
