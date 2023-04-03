import { Component, OnInit } from '@angular/core';
import { VenuesService, Venue } from '../../venues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item, LSContent } from 'src/app/shared/item.model';
import { ItemByLanguage } from '../../../../shared/item.model';
import { ItemDetailsDbService } from './item-details-db.service';
import { SnackbarService } from '../../../shared/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { WarningComponent } from '../../../shared/warning/warning.component';
import { ItemDetailsStService } from './item-details-st.service';
import { ErrPageComponent } from '../../../shared/err-page/err-page.component';

@Component({
    selector: 'app-item-details',
    templateUrl: './item-details.component.html',
    styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {
    venue: Venue;
    venueId: string;
    itemId: string;
    item: Item;
    form: FormGroup;
    addItemForm: FormGroup
    // languages: string[] = []
    selectedLanguage: string;
    showLanguageForm: boolean = false;

    creatingItemMode: boolean = false;
    // addingLanguageMode: boolean = true;
    lsc: LSContent

    editItemMode: boolean = false;
    editLanguageMode: boolean = false;
    languageSelectedMode: boolean = false;
    addingLanguageMode: boolean = false;
    languagesSpecificContent: LSContent[] = [];
    addOrEditLanguageMode: boolean = false
    private languages: string[] = ['dutch', 'english', 'german'];

    constructor(
        private route: ActivatedRoute,
        public venuesService: VenuesService,
        private fb: FormBuilder,
        private router: Router,
        private snackBar: MatSnackBar,
        private itemDetailsDbService: ItemDetailsDbService,
        private itemDetailsStService: ItemDetailsStService,
        private dialog: MatDialog
        // private snackbarService: SnackbarService
    ) { }

    ngOnInit(): void {
        // this.initForm();
        // this.initAddItemForm();
        this.route.params.subscribe((params: any) => {
            this.venueId = params.venueId;
            this.venuesService.readVenue(this.venueId).subscribe((venue: Venue) => {
                this.venue = venue;
            })
            this.itemId = params.itemId;
            if (!this.itemId) {
                this.dialog.open(ErrPageComponent, {
                    data: {
                        message: 'No item id'
                    }
                })
                this.router.navigate(['admin/venue-details', { venueId: this.venue.id }])
            } else {

                const sub = this.itemDetailsDbService.getLanguagesSpecificContentByItemId(this.venueId, this.itemId)
                    .subscribe((languagesSpecificContent: LSContent[]) => {
                        console.log(languagesSpecificContent)
                        this.languagesSpecificContent = languagesSpecificContent
                    });
                console.log('// 02 ADD LANGUAGE OR 03 EDIT LANGUAGE OR 04 DELETE LANGUAGE')
                this.itemDetailsDbService.readItem(this.venueId, this.itemId).subscribe((item: Item) => {
                    this.item = item
                    this.editItemMode = true;
                    this.creatingItemMode = false;

                })
                sub.unsubscribe();
            }
        })
    }

    // onGetQrCode() {
    //     this.router.navigate(['/admin/qr-code', { venueId: this.venue.id, itemId: this.item.id }])
    // }


    getAvailableLanguages() {
        if (this.item) {
            const availableLanguages: string[] = [];

            const languagesTaken: string[] = []
            console.log(this.item)
            const sub = this.itemDetailsDbService.getAvailableLanguages(this.venue.id, this.item.id)
                .subscribe((lsSC: LSContent[]) => {
                    lsSC.forEach((lSC: LSContent) => {
                        languagesTaken.push(lSC.language);
                    })
                    this.languages.forEach((language: string) => {
                        if (!languagesTaken.includes(language)) {
                            availableLanguages.push(language)
                        }
                    });
                    console.log(availableLanguages)
                    this.languages = availableLanguages
                })
            sub.unsubscribe();
        }
        return null
    }

    // initForm() {
    //     this.form = this.fb.group({
    //         name: new FormControl(null, [Validators.required]),
    //         description: new FormControl(null)
    //     })
    // }
    onItemImageFileInputChange(e) {
        const itemImageFile = e.target.files[0]
        this.itemDetailsStService.storeItemImage(this.venue.id, this.item.id, itemImageFile)
            .then((itemImageUrl: string) => {
                this.item.imageUrl = itemImageUrl
                this.venuesService.updateItemImageUrl(this.venue.id, this.item.id, itemImageUrl)
                    .then((res) => {
                        // this.snackBar.open('itemImageUrl updated', null, {
                        //     duration: 5000
                        // })
                    })
            })
    }
    onDeleteImage() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'This will permanty remove the image'
            }
        })
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.itemDetailsStService.deleteItemImageFile(this.venue.id, this.item.id)
                    .then((res) => {
                        this.snackBar.open('image removed from storage', null, {
                            duration: 5000
                        })
                        this.itemDetailsDbService.updateItemImageUrl(
                            this.venue.id,
                            this.item.id,
                            ''
                        )
                            .then((res) => {
                                this.snackBar.open('itemUrl updated', null, {
                                    duration: 5000
                                })
                            })
                    })
            }
        })
    }
    onAddCoordinates() {
        this.router.navigate(['/admin/coordinates', {
            venueId: this.venue.id,
            venueName: this.venue.venueName,
            itemId: this.item.id,
            itemName: this.item.name
        }])
    }

    onMainPage() {
        const sub = this.itemDetailsDbService.readItems(this.venueId)
            .subscribe((items: Item[]) => {
                const mainItems = items.filter((item: Item) => {
                    return item.isMainItem
                })
                console.log(mainItems.length)
                if (mainItems.length != 0 && !this.item.isMainItem) {
                    this.dialog.open(WarningComponent, {
                        data: {
                            message: 'The venue already has an item designated as \'main page\'. Alter the status of this item before assigning a new item as your main page.'
                        }
                    })
                } else {
                    this.router.navigate(['admin/main-page', { venueId: this.venueId, itemId: this.item.id }])
                }
                sub.unsubscribe();
            })
    }

    onEditItemName() {
        console.log(this.item.id);
        this.router.navigate(['admin/new-item', { venueId: this.venue.id, itemId: this.item.id }]);
    }

    onAddLanguage() {
        this.addingLanguageMode = true;
        this.getAvailableLanguages();
    }

    onLanguageSelected(e) {
        const language = e.value;

        const lsc: LSContent = {
            language: language
        }
        this.itemDetailsDbService.setLanguageToItem(this.venue.id, this.item.id, language, lsc)
            .then((docRef: any) => {
                console.log(docRef);
                this.router.navigate(['/admin/item-lsc-details', { venueId: this.venue.id, itemId: this.item.id, language }])
            })
            .catch(err => console.log(err));


        this.itemDetailsDbService.getLSCbyLanguage(this.venue.id, this.item.id, this.selectedLanguage)
            .subscribe((lsc: LSContent) => {
                this.lsc = lsc;
            })
    }



    onDeleteLSC(language: string) {
        console.log(language)
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'This will remove the selected language specific data from the item'
            }
        })
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.itemDetailsDbService.getLSCbyLanguage(this.venue.id, this.item.id, language)
                    .subscribe((lsc: LSContent) => {
                        if (lsc.audioUrl) {
                            this.itemDetailsStService.deleteAudioFileAndUpdateUrl(this.venue.id, this.item.id, language)
                                .then((res) => {
                                    this.snackBar.open('audio file deleted', null, {
                                        duration: 5000
                                    })
                                })
                                .catch((err) => {
                                    this.snackBar.open(res, null, {
                                        duration: 5000
                                    })
                                })
                        }
                    })
                this.itemDetailsDbService.deleteLSC(
                    this.venue.id,
                    this.item.id,
                    language
                ).then((res) => {
                    this.snackBar.open('LSC data deleted', null, {
                        duration: 5000
                    })
                }).catch((err) => {
                    this.snackBar.open(err, null, {
                        duration: 5000
                    })
                })
            } else {
                this.snackBar.open('No LSC data deleted ')
            }
        })
    }


    onBackToVenueDetails() {
        if (
            this.editLanguageMode == false &&
            this.addingLanguageMode == false &&
            this.languageSelectedMode == false) {
            this.router.navigate(['admin/venue-details', { venueId: this.venue.id }])
        } else {
            this.editLanguageMode = false;
            this.addingLanguageMode = false;
            this.languageSelectedMode = false;
        }
        // this.form.reset();
        this.selectedLanguage = null;

    }
}
