import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { VenuesService } from '../../venues.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { ItemDetailsDbService } from '../../../services/item-details-db.service';
import { Venue, Item, IdParams } from 'src/app/shared/item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as fromAdmin from 'src/app/admin/store/admin.reducer';
import * as Admin from 'src/app/admin/store/admin.actions';
import { Store } from '@ngrx/store'
import { VenuesService } from 'src/app/admin/services/venues.service';
import { ItemDetailsDbService } from 'src/app/admin/services/item-details-db.service';

@Component({
    selector: 'app-new-item',
    templateUrl: './new-item.component.html',
    styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent implements OnInit {

    venue: Venue;
    newItemForm: FormGroup;
    editmode: boolean = false;
    item: Item;
    itemId: string;
    venueId: string;

    constructor(
        private route: ActivatedRoute,
        private venuesService: VenuesService,
        private fb: FormBuilder,
        private itemDetailDbService: ItemDetailsDbService,
        private snackbar: MatSnackBar,
        private router: Router,
        private store: Store<fromAdmin.AdminState>

    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: IdParams) => {
            this.venueId = params.venueId;
            this.itemId = params.itemId
        })
        this.initNewItemForm()
        this.store.select(fromAdmin.getVenue).subscribe((venue: Venue) => {
            this.venue = venue;
        })
        this.store.select(fromAdmin.getItem).subscribe((item: Item) => {
            if (item) {
                this.item = item;
                this.editmode = true;
                this.newItemForm.patchValue({
                    name: item.name
                })
            }
        })
    }

    private initNewItemForm(): void {
        this.newItemForm = this.fb.group({
            name: new FormControl(null, [Validators.required])
        })
    }
    public onAddNewItem(): void {
        const name = this.newItemForm.value.name;
        const item: Item = {
            name: name
        }
        if (!this.editmode) {
            this.itemDetailDbService.createItem(this.venueId, item)
            // .then((docRef) => {
            //     this.itemId = docRef.id
            //     this.store.dispatch(new Admin.SetItem(item))
            //     this.snackbar.open('new item added', null, {
            //         duration: 5000
            //     })
            //     this.router.navigate(['admin/item-details', { venueId: this.venueId, itemId: this.itemId }])

            // })
            // .catch(err => {
            //     this.snackbar.open('adding new item failed', null, {
            //         duration: 5000
            //     })
            //     this.navigateToVenue();
            // })
        } else {
            this.itemDetailDbService.updateItemName(this.venueId, this.itemId, name)
                .then((res) => {
                    this.snackbar.open('Item name updated', null, {
                        duration: 5000
                    })
                    this.router.navigate(['admin/item-details', { venueId: this.venueId, itemId: this.itemId }])
                })
                .catch((err) => {
                    this.snackbar.open(`Updating item name failed ${err}`, null, {
                        duration: 5000
                    })
                })
        }
    }
    public onCancel(): void {
        this.router.navigate(['admin/venue-details', {
            venueId: this.venueId,
            itemId: this.itemId,
        }])
    }
    private navigateToVenue() {
        this.router.navigate(['admin/venues', {
            venueId: this.venueId,
            itemId: this.itemId,

        }])
    }
}
