import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ItemDetailsDbService } from '../../../../services/item-details-db.service';
// import { Item } from '../../../../../shared/item.model';
import { MatDialog } from '@angular/material/dialog';
// import { WarningComponent } from '../../../../shared/warning/warning.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import * as fromAdmin from 'src/app/admin/store/admin.reducer';
import * as Admin from 'src/app/admin/store/admin.reducer'
import { Item } from 'src/app/shared/item.model';
import { ItemDetailsDbService } from 'src/app/admin/services/item-details-db.service';

@Component({
    selector: 'app-main-item',
    templateUrl: './main-item.component.html',
    styleUrls: ['./main-item.component.scss']
})
export class MainItemComponent implements OnInit {

    venueId: string;
    itemId: string;
    item: Item;

    constructor(
        private route: ActivatedRoute,
        private itemDetailsDbService: ItemDetailsDbService,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private router: Router,
        private store: Store<fromAdmin.AdminState>
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            this.venueId = params.venueId;
            this.itemId = params.itemId;

            this.store.select(fromAdmin.getItem)
                // this.itemDetailsDbService.readItem(this.venueId, this.itemId)
                .subscribe((item: Item) => {
                    this.item = item
                })

        })
    }

    onRadioChange(event) {
        const status = event.value;
        // console.log(status);
        // console.log(typeof (status));
        this.itemDetailsDbService.updateMainPageProperty(this.venueId, this.itemId, status)
            .then((res) => {
                this.snackbar.open('main page status updated', 'OK')
                this.navigateToItem();
            })
            .catch((err) => {
                this.snackbar.open(`Failed to update main page status, ${err}`, 'OK')
            })

    }


    onBackToItem() {
        this.snackbar.open('Action aborted, nothing changed', 'OK');
        this.navigateToItem()
    }

    private navigateToItem() {
        this.router.navigate(['/admin/item-details', { venueId: this.venueId, itemId: this.itemId }])
    }
}
