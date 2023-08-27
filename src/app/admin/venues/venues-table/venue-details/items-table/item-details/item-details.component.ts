import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
// import { VenuesService } from '../../venues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item, LSContent, Venue } from 'src/app/shared/item.model';

// import { ItemDetailsDbService } from '../../../services/item-details-db.service';
// import { SnackbarService } from '../../../shared/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
// import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
// import { WarningComponent } from '../../../shared/warning/warning.component';
// import { ItemDetailsStService } from '../../../services/item-details-st.service';
// import { ErrPageComponent } from '../../../shared/err-page/err-page.component';
import * as fromAdmin from 'src/app/admin/store/admin.reducer';
import * as Admin from 'src/app/admin/store/admin.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LscService } from 'src/app/admin/services/lsc.service';
import { LanguageOptionsDialogComponent } from './language-options-dialog/language-options-dialog.component';
import { SetIsAdmin } from 'src/app/admin/auth/auth.actions';
import { VenuesService } from 'src/app/admin/services/venues.service';
import { ItemDetailsDbService } from 'src/app/admin/services/item-details-db.service';
import { ItemDetailsStService } from 'src/app/admin/services/item-details-st.service';
import { ConfirmComponent } from 'src/app/admin/shared/confirm/confirm.component';


@Component({
    selector: 'app-item-details',
    templateUrl: './item-details.component.html',
    styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {
    // venue: Venue;
    // @Input('venueId') private venueId: string;
    @ViewChild('fileInput') public fileInput: ElementRef
    venue$: Observable<Venue>
    // venueId: string;
    venueId: string
    itemId: string;
    item: Item;
    item$: Observable<Item>
    form: FormGroup;
    addItemForm: FormGroup
    // languages: string[] = []
    selectedLanguage: string;
    showLanguageForm: boolean = false;

    creatingItemMode: boolean = false;
    // addingLanguageMode: boolean = true;
    lsc: LSContent

    editItemMode: boolean = true;
    editLanguageMode: boolean = false;
    languageSelectedMode: boolean = false;
    addingLanguageMode: boolean = false;
    lscs: LSContent[] = [];
    addOrEditLanguageMode: boolean = false
    private languageOptions: string[] = [];

    constructor(
        private route: ActivatedRoute,
        public venuesService: VenuesService,
        private fb: FormBuilder,
        private router: Router,
        private snackBar: MatSnackBar,
        private itemDetailsDbService: ItemDetailsDbService,
        private itemDetailsStService: ItemDetailsStService,
        private dialog: MatDialog,
        private store: Store<fromAdmin.AdminState>,
        private lscService: LscService,

        // private snackbarService: SnackbarService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            this.venueId = params.venueId
            this.itemId = params.itemId
        })
        this.venue$ = this.store.select(fromAdmin.getVenue);
        this.item$ = this.store.select(fromAdmin.getItem);
    }

    // onGetQrCode() {
    //     this.router.navigate(['/admin/qr-code', { venueId: this.venue.id, itemId: this.item.id }])
    // }


    getAvailableLanguages() {
        this.lscService.getAvailableLanguages()
        // .then((availableLanguages: string[]) => {
        //     console.log(availableLanguages);
        //     this.languageOptions = availableLanguages
        // })
        // this.store.select(fromAdmin.getVenue).subscribe((venue: Venue) => {
        //     this.store.select(fromAdmin.getItem).subscribe((item: Item) => {
        //         const availableLanguages: string[] = [];
        //         const languagesTaken: string[] = []
        //         this.lscService.getLscs(venue.id, item.id).subscribe((lscs: LSContent[]) => {
        //             console.log(lscs);
        //             lscs.forEach((lsc: LSContent) => {
        //                 languagesTaken.push(lsc.language)
        //             })
        //             this.languageOptions.forEach((languageOption: string) => {
        //                 if (!languagesTaken.includes(languageOption)) {
        //                     availableLanguages.push(languageOption)
        //                 }
        //                 this.languageOptions = availableLanguages
        //             })
        //         })
        //     })
        // })
    }


    onItemImageFileInputChange(e) {
        console.log(e.target.files[0]);
        console.log(this.venueId, this.itemId)
        const itemImageFile = e.target.files[0]
        this.itemDetailsStService.storeItemImage(this.venueId, this.itemId, itemImageFile)
            .then((itemImageUrl: string) => {
                this.venuesService.updateItemImageUrl(this.venueId, this.itemId, itemImageUrl)
                    .then((res) => {
                        this.itemDetailsDbService.readItem(this.venueId, this.itemId)
                        this.snackBar.open('itemImageUrl updated', null, {
                            duration: 5000
                        })
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
                this.itemDetailsStService.deleteItemImageFile(this.venueId, this.itemId)
                    .then((res) => {
                        this.snackBar.open('image removed from storage', null, {
                            duration: 5000
                        })
                        this.itemDetailsDbService.updateItemImageUrl(
                            this.venueId,
                            this.itemId,
                            ''
                        )
                            .then(() => {
                                this.snackBar.open('itemUrl updated', null, {
                                    duration: 5000
                                })
                            })
                        this.fileInput.nativeElement.value = null;
                    }).catch((err) => {
                        console.log(`unable to remove image; ${err}`)
                    })
            }
        })
    }
    onAddCoordinates() {
        this.router.navigate(['/admin/coordinates', {
            venueId: this.venueId,
            itemId: this.itemId
        }])
    }

    onMainPage() {
        // TODO
        // const sub = this.itemDetailsDbService.readItems(this.venueId)
        //     .subscribe((items: Item[]) => {
        //         const mainItems = items.filter((item: Item) => {
        //             return item.isMainItem
        //         })
        //         console.log(mainItems.length)
        //         if (mainItems.length != 0 && !this.item.isMainItem) {
        //             this.dialog.open(WarningComponent, {
        //                 data: {
        //                     message: 'The venue already has an item designated as \'main item\'. This main item has a green background behind it\'s name. Alter the status of this item before assigning a new item as your main page.'
        //                 }
        //             })
        //         } else {
        //             this.router.navigate(['admin/main-page', { venueId: this.venueId, itemId: this.item.id }])
        //         }
        //         sub.unsubscribe();
        //     })
    }

    onEditItemName() {
        // console.log(this.item.id);
        this.router.navigate(['admin/new-item', { venueId: this.venueId, itemId: this.itemId }]);
    }

    onAddLanguage() {
        const dialogRef = this.dialog.open(LanguageOptionsDialogComponent)
        dialogRef.afterClosed().subscribe((language: string) => {
            if (!language) {
                return
            } else {
                console.log(language);
                this.addingLanguageMode = false;

                this.store.dispatch(new Admin.SetSelectedLanguage(language))
                this.store.dispatch(new Admin.SetLanguageSpecificContent(null))
                this.router.navigate(['/admin/lsc-details', {
                    venueId: this.venueId,
                    itemId: this.itemId,
                    editmode: false,
                    language,
                }])
            }
        })
        // this.addingLanguageMode = true;
        // this.getAvailableLanguages();
    }

    onLanguageSelected(e) {
        // this.addingLanguageMode = false;
        // const languageName = e.value;
        // this.store.dispatch(new Admin.SetSelectedLanguage(languageName))
        // this.store.dispatch(new Admin.SetLanguageSpecificContent(null))
        // this.router.navigate(['/admin/lsc-details', {
        //     languageName
        // }])

        // this.store.select(fromAdmin.getLanguage).subscribe((lsc: LSContent) => {
        //     this.lsc = lsc;
        // })


    }






    onBackToItems() {
        if (
            this.editLanguageMode == false &&
            this.addingLanguageMode == false &&
            this.languageSelectedMode == false) {
            this.router.navigate(['admin/venue-details', {
                venueId: this.venueId
            }
            ])
        } else {
            this.editLanguageMode = false;
            this.addingLanguageMode = false;
            this.languageSelectedMode = false;
        }
        // this.form.reset();
        this.selectedLanguage = null;

    }
}
