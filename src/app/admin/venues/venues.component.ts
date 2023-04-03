import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Venue, VenuesService } from './venues.service';
// import { Observable } from 'rxjs';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatDialog } from '@angular/material/dialog';
// import { ConfirmComponent } from '../shared/confirm/confirm.component';
// import { Item } from 'src/app/shared/item.model';
// import { ItemDetailsDbService } from './venue-details/item-details/item-details-db.service';
// import { NewVenueService } from './new-venue.service.tsXXX';

@Component({
    selector: 'app-venues',
    templateUrl: './venues.component.html',
    styleUrls: ['./venues.component.scss']
})
export class VenuesComponent implements OnInit {

    // venues$: Observable<Venue[]>

    constructor(
        // public venuesService: VenuesService,
        private router: Router,
        // private snackBar: MatSnackBar,
        // private dialog: MatDialog,
        // private itemDetailsDbService: ItemDetailsDbService,
    ) { }

    ngOnInit(): void {

    }

    // onStats(venueId: string) {
    //     console.log(venueId)
    // }
    // onQrCode(venueId: string, venueName: string) {
    //     console.log(venueId)
    //     this.router.navigate(['admin/qr-code', { venueId, venueName }])
    // }
    // onDelete(venueId: string) {
    //     const subscription = this.itemDetailsDbService.readItems(venueId).subscribe((items: Item[]) => {
    //         console.log(items)
    //         if (items.length > 0) {
    //             alert('delete items before deleting venue');
    //             subscription.unsubscribe();
    //             return false;
    //         } else {
    //             const dialogRef = this.dialog.open(ConfirmComponent, {
    //                 data: {
    //                     venueId
    //                 }
    //             })
    //             dialogRef.afterClosed().subscribe((res) => {
    //                 if (res) {
    //                     this.venuesService.deleteVenue(venueId)
    //                         .then((res) => {
    //                             console.log(res)
    //                             this.snackBar.open('venue deleted', null, {
    //                                 duration: 5000
    //                             })
    //                         })
    //                 }
    //             })
    //         }
    //     })
    // }

    // onVenueDetails(venueId: string) {
    //     this.router.navigate(['admin/venue-details', { venueId }])
    // }

    onAddVenue() {
        this.router.navigate(['admin/venue-details'])
    }
}
