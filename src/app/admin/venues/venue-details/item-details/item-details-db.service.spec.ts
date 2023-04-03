import { TestBed } from '@angular/core/testing';

import { ItemDetailsDbService } from './item-details-db.service';

describe('ItemDetailsDbService', () => {
  let service: ItemDetailsDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemDetailsDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
