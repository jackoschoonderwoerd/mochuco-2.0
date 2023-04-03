import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// import { ScannerService } from './scanner.service';
// import { ItemService } from '../item/item.service';


@Component({
    selector: 'app-scanner',
    templateUrl: './scanner.component.html',
    styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {


    public scannerEnabled: boolean = true;
    public url

    constructor(private router: Router) { }

    ngOnInit() {
        this.scannerEnabled = true;

    }

    public scanSuccessHandler(event: any) {
        // this.url = event;
        // this.router.navigate(['user', { url: event }])
        // console.log(event)
        // this.scannerEnabled = false;
        const url = new URL(event)
        const queryParameters = url.searchParams;
        const venueId = queryParameters.get('venueId')
        const itemId = queryParameters.get('itemId')
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
}
