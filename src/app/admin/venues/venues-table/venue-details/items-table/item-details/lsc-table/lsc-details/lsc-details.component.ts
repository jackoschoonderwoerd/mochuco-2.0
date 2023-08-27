import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { Venue, LSContent, Item } from '../../../../../../shared/item.model';
// import { ItemDetailsDbService } from '../../../../../services/item-details-db.service';
// import { ItemDetailsStService } from '../../../../../services/item-details-st.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { ErrPageComponent } from '../../../../../shared/err-page/err-page.component';
// import { VenuesService } from '../../../../venues.service';
// import { ConfirmComponent } from '../../../../../shared/confirm/confirm.component';
import * as fromAdmin from 'src/app/admin/store/admin.reducer'
import * as Admin from 'src/app/admin/store/admin.actions'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs';
import { LscService } from 'src/app/admin/services/lsc.service';
import { Item, LSContent, Venue } from 'src/app/shared/item.model';
import { ItemDetailsDbService } from 'src/app/admin/services/item-details-db.service';
import { ItemDetailsStService } from 'src/app/admin/services/item-details-st.service';
import { VenuesService } from 'src/app/admin/services/venues.service';
import { ErrPageComponent } from 'src/app/admin/shared/err-page/err-page.component';
import { ConfirmComponent } from 'src/app/admin/shared/confirm/confirm.component';

@Component({
    selector: 'app-lsc-details',
    templateUrl: './lsc-details.component.html',
    styleUrls: ['./lsc-details.component.scss']
})
export class LscDetailsComponent implements OnInit {

    lsc: LSContent;
    venueId: string;
    itemId: string;
    item: Item;
    venue: Venue;
    lscs$: Observable<LSContent[]>;
    item$: Observable<Item>
    venue$: Observable<Venue>;
    lsc$: Observable<LSContent>
    selectedLanguageName$: Observable<string>;
    language: string;
    editmode: boolean;

    constructor(
        private route: ActivatedRoute,
        private itemDetailsDbService: ItemDetailsDbService,
        private router: Router,
        private itemDetailsStService: ItemDetailsStService,
        private snackbar: MatSnackBar,
        private dialog: MatDialog,
        private venuesService: VenuesService,
        private store: Store<fromAdmin.AdminState>,
        private lscService: LscService

    ) { }

    ngOnInit(): void {

        this.route.params.subscribe((params: any) => {
            console.log(params)
            this.venueId = params.venueId;
            this.itemId = params.itemId;
            this.language = params.language;
            this.editmode = params.editmode
        })

        // this.store.subscribe((storeData: any) => console.log(storeData));
        this.item$ = this.store.select(fromAdmin.getItem)
        this.venue$ = this.store.select(fromAdmin.getVenue)
        this.lsc$ = this.store.select(fromAdmin.getLanguage);
        this.selectedLanguageName$ = this.store.select(fromAdmin.getSelectedLanguageName);
        // this.lscs$ = this.store.select(fromAdmin.getLanguages)
        // this.lsc$ = this.store.select(fromAdmin.)
        // this.route.params.subscribe((params: any) => {
        //     this.venueId = params.venueId;
        //     this.itemId = params.itemId;
        //     this.language = params.language;
        //     this.itemDetailsDbService.getLSCbyLanguage(
        //         this.venueId, this.itemId, this.language
        //     ).subscribe((lsc: LSContent) => {
        //         this.lsc = lsc
        //     })
        //     this.store.select(fromAdmin.getVenue).subscribe((venue: Venue) => {
        //         this.venue = venue;
        //     })

        //     this.store.select(fromAdmin.getItem)
        //         .subscribe((item: Item) => {
        //             this.item = item;
        //         })
        // })

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
        // console.log(e.target.files[0])
        this.itemDetailsStService.storeAudio(this.venueId, this.itemId, this.language, audioFile)
            .then((audioUrl) => {
                console.log(audioUrl)
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
        // .catch((err) => {
        //     this.dialog.open(ErrPageComponent, {
        //         data: {
        //             message: 'unable to store audio file'
        //         }
        //     })
        // })
    }

    onDeleteAudio() {
        // console.log(language);
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'This will permanently remove the selected audio file'
            }
        })
        this.lsc$.subscribe((lsc: LSContent) => {

            dialogRef.afterClosed().subscribe((res: any) => {
                if (res) {
                    this.lscService.deleteAudioFileAndUpdateUrl(this.venueId, this.itemId, lsc.language)
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
                    this.snackbar.open(`deletion ${lsc.language} aborted`, 'OK')
                }
            })
        })
    }

    onBackToItem() {
        this.router.navigate(['/admin/item-details', { venueId: this.venueId, itemId: this.itemId }])
    }
}
