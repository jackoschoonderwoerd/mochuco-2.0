// https://github.com/zxing-js/ngx-scanner/wiki/Advanced-Usage

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';

import { Venue, Item } from 'src/app/shared/item.model';

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
        this.scannerEnabled = true;
    }

    public scanSuccessHandler(event: any) {
        console.log(event)
        const url = new URL(event)
        const queryParameters = url.searchParams;
        const venueId = queryParameters.get('venueId')
        const itemId = queryParameters.get('itemId')
        if (!venueId) {
            this.router.navigate(['user-error-pag', { message: 'No venueId at scanner level' }])
        } else if (venueId && !itemId) {
            this.itemService.setVenueObservable(venueId)

        } else if (venueId && itemId) {
            this.itemService.setVenueObservable(venueId)
            this.itemService.setItemObservable(venueId, itemId)
        }
        this.itemService.setObservables(venueId, itemId);
        this.scannerEnabled = false;
        // this.router.navigateByUrl('user')
    }


    exit() {
        this.router.navigateByUrl('user')
    }
    onNearestItem() {
        this.itemService.setObservables('F4TmvZS3LTLLSGocx5tQ')
    }
    onBrug226() {
        // this.itemService.setItemObservable('F4TmvZS3LTLLSGocx5tQ', 'SIC19OzpEWdj1TVmQ40T');
        this.itemService.setObservables('F4TmvZS3LTLLSGocx5tQ', 'SIC19OzpEWdj1TVmQ40T');
    }
    onMuntsluis() {
        this.itemService.setObservables('F4TmvZS3LTLLSGocx5tQ', 'dGt9AIVaEbk0FaqswnLC');
    }

}
