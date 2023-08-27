import { TestBed } from '@angular/core/testing';

import { ItemDetailsStService } from './item-details-st.service';

describe('ItemDetailsStService', () => {
  let service: ItemDetailsStService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemDetailsStService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
