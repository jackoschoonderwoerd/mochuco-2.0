import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ItemDetailsDbService } from '../../../../services/item-details-db.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
// import { IdParams, Item } from '../../../../../shared/item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';


import { Store } from '@ngrx/store';
import * as fromAdmin from 'src/app/admin/store/admin.reducer'

import { ItemDetailsDbService } from 'src/app/admin/services/item-details-db.service';
import { IdParams, Item } from 'src/app/shared/item.model';
import { ConfirmComponent } from 'src/app/admin/shared/confirm/confirm.component';

@Component({
    selector: 'app-coordinates',
    templateUrl: './coordinates.component.html',
    styleUrls: ['./coordinates.component.scss']
})
export class CoordinatesComponent implements OnInit {

    coordinatesForm: FormGroup;
    private venueId: string;
    venueName: string;
    private itemId: string;
    editmode: boolean = false;
    item: Item;

    constructor(
        private route: ActivatedRoute,
        private itemDetailsDbService: ItemDetailsDbService,
        private fb: FormBuilder,
        private router: Router,
        private snackbar: MatSnackBar,
        private dialog: MatDialog,
        private store: Store<fromAdmin.AdminState>
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: IdParams) => {

            this.venueId = params.venueId;
            this.itemId = params.itemId;
        })
        this.initCoordinatesForm();
        this.store.select(fromAdmin.getItem)
            .subscribe((item: Item) => {
                if (item) {
                    // console.log(item)
                    this.item = item;
                    this.editmode = true;
                    this.coordinatesForm.patchValue({
                        latitude: item.latitude,
                        longitude: item.longitude
                    })
                }
            })

    }
    initCoordinatesForm() {
        this.coordinatesForm = this.fb.group({
            latitude: new FormControl(null, [Validators.required]),
            longitude: new FormControl(null, Validators.required)
        })
    }
    onAddCoordinates() {
        const formValue = this.coordinatesForm.value;
        console.log(this.venueId, this.itemId, formValue);

        return this.itemDetailsDbService.updateItemCoordinates(
            this.venueId,
            this.itemId,
            formValue.latitude,
            formValue.longitude)
            .then((res: any) => {
                if (!this.editmode) {
                    this.snackbar.open('coordinates added', 'OK')
                } else {
                    this.snackbar.open('coordinates updated', 'OK')
                }
                this.navigateToItemDetails()
            })
            .catch((err) => {
                console.log(err);
            })
    }
    onDeleteCoordinates() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'This will permanently delete the coordinates from the active item'
            }
        })
        dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
                return this.itemDetailsDbService.updateItemCoordinates(
                    this.venueId,
                    this.itemId,
                    null,
                    null)
                    .then((res: any) => {
                        this.snackbar.open('coordinates deleted', 'OK')
                        this.navigateToItemDetails()
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            } else {
                this.snackbar.open('Action aborted, no changes made', 'OK');
            }
        })
    }
    onBackToItem() {
        this.snackbar.open('action aborted, no changes made', 'OK')
        this.navigateToItemDetails()
    }
    private navigateToItemDetails() {
        this.router.navigate(['admin/item-details', { venueId: this.venueId, itemId: this.itemId }])
    }
}
