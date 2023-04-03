import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LSContent, Item } from '../../../../../../shared/item.model';
import { ItemDetailsDbService } from '../../item-details-db.service';
import { ItemDetailsStService } from '../../item-details-st.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrPageComponent } from '../../../../../shared/err-page/err-page.component';
import { Venue, VenuesService } from '../../../../venues.service';
import { ConfirmComponent } from '../../../../../shared/confirm/confirm.component';

@Component({
    selector: 'app-item-lsc-details',
    templateUrl: './item-lsc-details.component.html',
    styleUrls: ['./item-lsc-details.component.scss']
})
export class ItemLscDetailsComponent implements OnInit {

    lsc: LSContent;
    venueId: string;
    itemId: string;
    language: string;
    item: Item;
    venue: Venue

    constructor(
        private route: ActivatedRoute,
        private itemDetailsDbService: ItemDetailsDbService,
        private router: Router,
        private itemDetailsStService: ItemDetailsStService,
        private snackbar: MatSnackBar,
        private dialog: MatDialog,
        private venuesService: VenuesService,

    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            this.venueId = params.venueId;
            this.itemId = params.itemId;
            this.language = params.language;
            this.itemDetailsDbService.getLSCbyLanguage(
                this.venueId, this.itemId, this.language
            ).subscribe((lsc: LSContent) => {
                this.lsc = lsc
            })
            this.venuesService.readVenue(this.venueId)
                .subscribe((venue: Venue) => {
                    this.venue = venue
                })
            this.itemDetailsDbService.readItem(this.venueId, this.itemId)
                .subscribe((item: Item) => {
                    this.item = item;
                })
        })

    }
    onEditName() {
        this.router.navigate(
            ['/admin/item-lsc-name',
                {
                    venueId: this.venueId,
                    itemId: this.itemId,
                    language: this.language
                }
            ]
        )
    }
    onEditDescription() {
        this.router.navigate(
            ['/admin/item-lsc-description',
                {
                    venueId: this.venueId,
                    itemId: this.itemId,
                    language: this.language
                }
            ]
        )
    }
    audioSelected(e) {
        const audioFile: File = e.target.files[0]
        console.log(e.target.files[0])
        this.itemDetailsStService.storeAudio(this.venueId, this.itemId, this.language, audioFile)
            .then((audioUrl) => {
                this.snackbar.open('audiofile stored', null, {
                    duration: 5000
                });

                this.itemDetailsDbService.updateItemAudioUrl(
                    this.venueId,
                    this.itemId,
                    this.language,
                    audioUrl
                )
                    .then((res) => {
                        this.snackbar.open('audio url updated', null, {
                            duration: 5000
                        })
                    })
                    .catch(err => {
                        this.dialog.open(ErrPageComponent, {
                            data: {
                                message: 'unable to update audio url'
                            }
                        })

                    })

            })
            .catch((err) => {
                this.dialog.open(ErrPageComponent, {
                    data: {
                        message: 'unable to store audio file'
                    }
                })
                this.snackbar.open('unable to store audio file')
            })
    }

    onDeleteAudio(language: string) {
        console.log(language);
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'This will permanently remove the selected audio file'
            }
        })
        dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
                this.itemDetailsStService.deleteAudioFileAndUpdateUrl(this.venueId, this.item.id, language)
                // .then((res: any) => {
                //     this.snackbar.open(`audiofile ${language} removed from storage`, 'OK')
                //     this.itemDetailsDbService.updateAudioUrlFromDb(this.venueId, this.item.id, language)
                //         .then((res: any) => {
                //             this.snackbar.open(`audioUrl ${language} set to null`, 'OK');
                //         })
                //         .catch((err) => {
                //             this.snackbar.open(`failed to update audioUrl ${language} - ${err}`);
                //         });
                // })
                // .catch((err) => {
                //     this.snackbar.open('failed to remove audiofile for storage', 'OK')
                // })
            } else {
                this.snackbar.open(`deletion ${language} aborted`, 'OK')
            }
        })
    }

    onBackToItem() {
        this.router.navigate(['/admin/item-details', { venueId: this.venueId, itemId: this.itemId }])
    }
}
