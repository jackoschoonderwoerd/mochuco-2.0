import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';

import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ItemDetailsDbService } from '../../services/item-details-db.service';
import { Venue, Item, LSContent } from '../../../shared/item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WarningComponent } from '../../shared/warning/warning.component';
import { Store } from '@ngrx/store';
import * as fromAdmin from '../../store/admin.reducer';
import * as fromApp from './../../../app.reducer'
import { LscService } from '../../services/lsc.service';
import { Observable } from 'rxjs';
import { VenuesService } from '../../services/venues.service';

@Component({
    selector: 'app-venues-table',
    templateUrl: './venues-table.component.html',
    styleUrls: ['./venues-table.component.scss']
})
export class VenuesTableComponent implements OnInit {


    displayedVenueColumns: string[] = [
        'name',
        'qr-code-local',
        'qr-code',
        // 'stats',
        'delete',
        'edit'
    ]
    venuesDataSource = new MatTableDataSource<Venue>
    venues: Venue[];
    venue$: Observable<Venue>
    items$: Observable<Item[]>

    constructor(
        private afAuth: Auth,
        private venuesService: VenuesService,
        private router: Router,
        private dialog: MatDialog,
        private itemDetailsDbService: ItemDetailsDbService,
        private snackbar: MatSnackBar,
        private store: Store<fromAdmin.State>,
        private lscService: LscService
    ) { }

    ngOnInit(): void {
        this.store.select(fromAdmin.getVenues)
            .subscribe((venues: Venue[]) => {
                this.venues = venues
                this.venuesDataSource = new MatTableDataSource(venues);
            })
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.venuesDataSource.filter = filterValue.trim().toLowerCase();
    }
    onQrCodeLocal(venueId: string) {
        this.router.navigate(['/admin/qr-code', { venueId, local: true }])
    }

    onQrCode(venueId: string) {
        // console.log(venueId)
        this.router.navigate(['/admin/qr-code', { venueId }])
    }
    // onStats(venueId) {
    //     this.router.navigate(['/admin/stats', { venueId }])
    // }
    onDetails(venueId: string) {
        console.log(venueId)
        this.venuesService.readVenue(venueId);
        this.itemDetailsDbService.readItems(venueId);
        // this.itemDetailsDbService.readItem()
        this.router.navigate(['/admin/venue-details', {
            venueId
        }])
    }

    // 1 DELETE AUDIO FROM ALL LANGUAGES

    onDeleteVenue(venueId: string) {
        console.log(venueId)
        this.itemDetailsDbService.readItemsLength(venueId).subscribe((items: Item[]) => {
            console.log(items.length)
            if (items.length) {
                console.log('delete items first')
                this.dialog.open(WarningComponent, {
                    data: {
                        message: 'Delete all Items before deleting the Venue'
                    }
                })
            } else {
                console.log('proceed')
                const dialogRef = this.dialog.open(ConfirmComponent, {
                    data: {
                        message: 'This will premanently delete the venue'
                    }
                })
                dialogRef.afterClosed().subscribe((res) => {
                    if (res) {
                        this.venuesService.deleteVenue(venueId)
                    }
                    return;
                })
            }
        })
        // this.store.select(fromAdmin.getItems).subscribe((items) => {
        //     console.log(items);
        // })

        // const subOne = this.venuesService.readItems(venueId).subscribe((items: Item[]) => {
        //     if (items.length == 0) {
        //         this.venuesService.deleteVenue(venueId).then(res => {
        //             this.snackbar.open(`Venue ${venueId} deleted`, 'OK');
        //         })
        //     } else {
        //         this.dialog.open(WarningComponent, {
        //             data: {
        //                 message: 'Out of precaution it is not possible to delete a venue that contains items. Please delete all items before deleting the venue.'
        //             }
        //         })
        //     }
        //     items.forEach((item: Item) => {
        //         this.localReadLanguages(venueId, item.id, item.name)
        //     })
        //     subOne.unsubscribe();
        // })
    }
    private localReadLanguages(venueId: string, itemId: string, itemName: string) {
        // console.log('readLanguages(){} invoked')
        const subTwo = this.venuesService.readLanguages(venueId, itemId,)
            .subscribe((lscs: LSContent[]) => {
                // console.log(lscs);
                lscs.forEach((lsc: LSContent) => {
                    if (lsc.audioUrl) {
                        if (confirm(`STORAGE / FIRESTORE: delete audio file ? ${itemName} - ${lsc.language}`)) {
                            this.localDeleteAudioFromStorage(venueId, itemId, itemName, lsc.language)
                        }

                    } else {
                        // console.log(`no audioUrl for ${itemName} - ${lsc.language}`);
                    }
                })

                subTwo.unsubscribe()
            })

    }
    private localDeleteAudioFromStorage(venueId: string, itemId: string, itemName: string, language: string) {
        // console.log('localDeleteAudioFromStorage(){} invoked.')
        return this.venuesService.deleteAudioFileFromSt(venueId, itemId, language)
            .then((res: any) => {
                console.log(`STORAGE: audio file ${itemName} - ${language} deleted`)
                if (confirm(`FIRESTORE: delete language: ${language}`)) {
                    this.lscService.deleteLSC(venueId, itemId, language)
                    // .then(() => {
                    //     console.log(`FIRESTORE: language: ${language} deleted`)
                    // })
                    // .catch(err => {
                    //     console.error(`FIRESTORE: language: ${language}`)
                    // })
                }
                // if (confirm(`FIRESTORE: set audioUrl to null? ${itemName} - ${language}`)) {
                //     this.localUpdateAudioUrlToNull(venueId, itemId, itemName, language)
                // }
            })
            .catch(err => console.log(err))
    }

    private localDeleteLanguage() {
        // this.itemDetailsDbService.deleteLSC(venueId, itemId, language)
    }
    private localUpdateAudioUrlToNull(venueId: string, itemId: string, itemName: string, language: string) {
        // console.log('localUpdateAudioUrlToNull(){} invoked');
        this.venuesService.updateAudioUrlToNull(venueId, itemId, language)
            .then((res: any) => {
                // console.log(`FIRESTORE: audioUrl ${itemName} - ${language} has been set to null`);

            })
            .catch(err => {
                console.log(err)
            });
    }
}
