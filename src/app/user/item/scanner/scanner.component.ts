import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';
import { Venue } from 'src/app/admin/venues/venues.service';
import { Item } from 'src/app/shared/item.model';

// import { ScannerService } from './scanner.service';
// import { ItemService } from '../item/item.service';


@Component({
    selector: 'app-scanner',
    templateUrl: './scanner.component.html',
    styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {

    private venueId: string;
    private itemId: string;
    public scannerEnabled: boolean = true;
    public url;


    constructor(
        private router: Router,
        private itemService: ItemService) { }

    ngOnInit() {

        this.itemService.venue$.subscribe((venue: Venue) => {
            if (venue) {
                this.venueId = venue.id
            }
        })
        this.itemService.item$.subscribe((item: Item) => {
            if (item) {
                console.log(item)
            }
        })
        this.scannerEnabled = true;
    }

    public scanSuccessHandler(event: any) {
        const url = new URL(event)
        const queryParameters = url.searchParams;
        const venueId = queryParameters.get('venueId')
        const itemId = queryParameters.get('itemId')
        this.itemService.setVenueObservable(venueId)
        this.itemService.setItemObservable(venueId, itemId)
        // this.router.navigate(['user'])
        this.router.navigate(['user'], {
            queryParams: {
                venueId: venueId,
                itemId: itemId
            }
        })
    }

    public enableScanner() {
        this.url = null;
        this.scannerEnabled = !this.scannerEnabled;
    }

    exit() {
        this.router.navigate(['user'], {
            queryParams: {
                venueId: this.venueId,
                itemId: this.itemId
            }
        })
    }
}
