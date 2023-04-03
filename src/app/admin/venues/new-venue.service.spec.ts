import { TestBed } from '@angular/core/testing';

import { NewVenueService } from './new-venue.service.tsXXX';

describe('NewVenueService', () => {
    let service: NewVenueService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NewVenueService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
