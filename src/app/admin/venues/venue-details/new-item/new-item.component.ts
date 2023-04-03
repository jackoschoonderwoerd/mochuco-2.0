import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Venue, VenuesService } from '../../venues.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ItemDetailsDbService } from '../item-details/item-details-db.service';
import { Item } from 'src/app/shared/item.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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

    constructor(
        private route: ActivatedRoute,
        private venuesService: VenuesService,
        private fb: FormBuilder,
        private itemDetailDbService: ItemDetailsDbService,
        private snackbar: MatSnackBar,
        private router: Router,

    ) { }

    ngOnInit(): void {
        this.initNewItemForm()
        this.route.params.subscribe((params: any) => {
            const venueId = params.venueId
            this.venuesService.readVenue(venueId).subscribe((venue: Venue) => {
                this.venue = venue;
            })
            if (params.itemId) {
                const itemId = params.itemId
                this.editmode = true;
                this.itemDetailDbService.readItem(venueId, itemId)
                    .subscribe((item: Item) => {
                        this.item = item;
                        this.newItemForm.patchValue({
                            name: item.name
                        })
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
            this.itemDetailDbService.createItem(this.venue.id, item)
                .then((docRef) => {
                    console.log(docRef.id);
                    const itemId = docRef.id;
                    this.snackbar.open('new item added', null, {
                        duration: 5000
                    })
                    this.router.navigate(['admin/item-details', { venueId: this.venue.id, itemId }])

                })
                .catch(err => {
                    this.snackbar.open('adding new item failed', null, {
                        duration: 5000
                    })
                    this.navigateToVenue();
                })
        } else {
            this.itemDetailDbService.updateItemName(this.venue.id, this.item.id, name)
                .then((res) => {
                    this.snackbar.open('Item name updated', null, {
                        duration: 5000
                    })
                    this.router.navigate(['admin/item-details', { venueId: this.venue.id, itemId: this.item.id }])
                })
                .catch((err) => {
                    this.snackbar.open(`Updating item name failed ${err}`, null, {
                        duration: 5000
                    })
                })
        }
    }
    public onCancel(): void {
        this.navigateToVenue();
    }
    private navigateToVenue() {
        this.router.navigate(['admin/item-details', { venueId: this.venue.id, itemId: this.item.id }])
    }
}
