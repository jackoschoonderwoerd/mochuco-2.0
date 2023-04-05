import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDetailsDbService } from '../../../item-details-db.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item, LSContent } from '../../../../../../../shared/item.model';
import { MatDialog } from '@angular/material/dialog';
import { ErrPageComponent } from 'src/app/admin/shared/err-page/err-page.component';
import { Venue } from 'src/app/admin/venues/venues.service';
import { VenuesService } from '../../../../../venues.service';

@Component({
    selector: 'app-lsc-item-name',
    templateUrl: './item-lsc-name.component.html',
    styleUrls: ['./item-lsc-name.component.scss']
})
export class ItemLscNameComponent implements OnInit {

    venueId: string;
    itemId: string;
    language: string;
    nameForm: FormGroup
    editmode: boolean = false;
    lsc: LSContent;
    item: Item;
    venue: Venue

    constructor(
        private route: ActivatedRoute,
        private itemDetailsDbService: ItemDetailsDbService,
        private venuesService: VenuesService,
        private fb: FormBuilder,
        private router: Router,
        private snackbar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.initNameForm()
        this.route.params.subscribe((params: any) => {
            this.venueId = params.venueId;
            this.venuesService.readVenue(this.venueId).subscribe((venue: Venue) => {
                this.venue = venue;
            })
            if (!params.itemId) {
                this.dialog.open(ErrPageComponent, {
                    data: {
                        message: 'no id in item-lsc-name.component'
                    }
                })
            } else {
                this.itemId = params.itemId;
                this.itemDetailsDbService.readItem(this.venueId, this.itemId).subscribe((item: Item) => {
                    this.item = item;
                })
                this.language = params.language;
                this.itemDetailsDbService.getLSCbyLanguage(this.venueId, this.itemId, this.language)
                    .subscribe((lsc: LSContent) => {
                        if (lsc) {
                            this.editmode = true
                            this.nameForm.patchValue({
                                name: lsc.name
                            })
                        } else {

                        }
                    })
            }
        })
    }
    initNameForm() {
        this.nameForm = this.fb.group({
            name: new FormControl(null, [Validators.required])
        })
    }
    onAddItemName() {
        const name = this.nameForm.value.name;
        if (!this.editmode) {
            const lsc: LSContent = {
                name: name,
                language: this.language,
                description: ''
            }
            this.itemDetailsDbService.setLanguageToItem(this.venueId, this.itemId, this.language, lsc)
                .then((res) => {
                    console.log(res)
                    this.snackbar.open(`lsc ${this.language} - ${name} added to ${this.itemId}`)
                    this.router.navigate(['admin/item-details', { venueId: this.venueId, itemId: this.itemId }])
                })
                .catch((err) => {
                    this.dialog.open(ErrPageComponent, {
                        data: {
                            message: `failed to add ${this.language} - ${name} to ${this.itemId}`
                        }
                    })
                })
        } else {
            this.itemDetailsDbService.udpdateItemNameByLanguage(this.venueId, this.itemId, this.language, name)
                .then((res) => {
                    this.snackbar.open('name added', null, {
                        duration: 5000
                    })
                    // this.navigateToItem();
                    this.navigateToLscDetails()
                })
                .catch((err) => {
                    this.snackbar.open(err, null, {
                        duration: 5000
                    })
                    this.navigateToItem();
                })
        }
    }
    onCancel() {
        this.navigateToLscDetails()
    }
    navigateToItem() {
        this.router.navigate(['admin/item-details', {
            itemId: this.itemId,
            venueId: this.venueId,
            language: this.language
        }])
    }
    navigateToLscDetails() {
        this.router.navigate(['/admin/item-lsc-details', {
            itemId: this.itemId,
            venueId: this.venueId,
            language: this.language
        }])
    }
}
