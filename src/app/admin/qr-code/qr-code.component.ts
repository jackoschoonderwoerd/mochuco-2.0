import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { VenuesService, Venue } from '../venues/venues.service';
import { Item } from '../../shared/item.model';
import { MatDialog } from '@angular/material/dialog';
import { ErrPageComponent } from '../shared/err-page/err-page.component';
import { ItemDetailsDbService } from '../venues/venue-details/item-details/item-details-db.service';

@Component({
    selector: 'app-qr-code',
    templateUrl: './qr-code.component.html',
    styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {

    @ViewChild('printArea') printArea: ElementRef

    qrSizeForm: FormGroup;
    itemNameFontSizeForm: FormGroup;
    venueNameFontSizeForm: FormGroup;
    qrData: string;

    width: number = 300;
    imageHeight: number = 75;
    imageWidth: number = 75;
    logoPath = './assets/2021-0705_Mochuco_-_Logo_zwart_wit_1000px.png'
    venue: Venue;
    item: Item;
    onlyVenueMode: boolean = false;
    qrLocal: boolean = false;


    @ViewChild('parent') private parent: ElementRef

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private venuesService: VenuesService,
        private dialog: MatDialog,
        private itemDetailsDbService: ItemDetailsDbService,
        private router: Router
    ) { }



    ngOnInit(): void {
        this.initQrSizeForm();
        this.initvenueNameFontSizeForm();
        this.inititemNameFontSizeForm()

        this.route.params.subscribe((params: any) => {
            console.log(params)
            const venueId = params.venueId
            if (params.local) {
                this.qrLocal = true
            }
            if (!venueId) {
                this.dialog.open(ErrPageComponent, {
                    data: {
                        message: 'Insufficient data, no Venue Id'
                    }
                })
            } else {
                this.venuesService.readVenue(venueId)
                    .subscribe((venue: Venue) => {
                        this.venue = venue
                        console.log(venue)
                    })
            }
            const itemId = params.itemId
            if (!itemId) {
                if (!this.qrLocal) {
                    this.onlyVenueMode = true
                    this.qrData = 'https://mochuco-20.web.app/user?venueId=' +
                        venueId
                } else {
                    this.qrData = `localhost:4200/user?venueId=${venueId}`
                }
            } else {
                this.itemDetailsDbService.readItem(venueId, itemId)
                    .subscribe((item: Item) => {
                        this.item = item
                    })
                if (!this.qrLocal) {
                    this.qrData = 'https://mochuco-20.web.app/user?venueId=' +
                        venueId +
                        '&itemId=' +
                        itemId
                } else {
                    this.qrData = `localhost:4200/user?venueId=${venueId}&itemId=${itemId}`
                }
            }

        })
    }
    initQrSizeForm() {
        this.qrSizeForm = this.fb.group({
            size: new FormControl(50, [Validators.min(10), Validators.max(100)])
        })
    }
    initvenueNameFontSizeForm() {
        this.venueNameFontSizeForm = this.fb.group({
            size: new FormControl(20, [Validators.min(10), Validators.max(100)])
        })
    }
    inititemNameFontSizeForm() {
        this.itemNameFontSizeForm = this.fb.group({
            size: new FormControl(36, [Validators.min(10), Validators.max(100)])
        })
    }

    // onAdjustSize() {
    //     const size = this.qrSizeForm.value.size
    //     this.width = size * 10;
    //     this.imageHeight = size * 2.5
    //     this.imageWidth = size * 2.5
    // }
    onQrSizeChange() {
        const size = this.qrSizeForm.value.size
        this.width = size * 10;
        this.imageHeight = size * 2.5
        this.imageWidth = size * 2.5
    }
    onVenueNameSizeChange() {

        return this.venueNameFontSizeForm.value.size + 'px';
    }
    onItemNameSizeChange() {
        return this.itemNameFontSizeForm.value.size + 'px';
    }

    onCreateDownloadLinkWithTitle() {
        console.log(this.printArea);
        html2canvas(this.printArea.nativeElement).then(canvas => {
            console.log(canvas)
            var image: any = canvas.toDataURL();
            var aDownloadLink = document.createElement('a');
            aDownloadLink.download = this.item.name;
            aDownloadLink.href = image;
            aDownloadLink.click();
        })
    }
    getPadingBottom() {
        return this.width / 12 + 'px';
    }
    onExitToApp() {
        if (!this.onlyVenueMode) {
            this.router.navigate(['/admin/venue-details', { venueId: this.venue.id, itemId: this.item.id }])
        } else {
            this.router.navigate(['/admin/venues'])
            // this.router.navigate(['/admin/venues'])
        }
    }

}


