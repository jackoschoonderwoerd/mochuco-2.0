import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
// import { ItemDetailsDbService } from '../../../services/item-details-db.service';
// import { Item, LSContent, Venue } from '../../../../shared/item.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
// import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { ItemDetailsStService } from '../../../services/item-details-st.service';
import { Auth } from '@angular/fire/auth';
import { MatSort, Sort } from '@angular/material/sort';
import * as fromAdmin from 'src/app/admin/store/admin.reducer';
import * as Admin from 'src/app/admin/store/admin.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Item, LSContent } from 'src/app/shared/item.model';
import { ItemDetailsDbService } from 'src/app/admin/services/item-details-db.service';
import { ItemDetailsStService } from 'src/app/admin/services/item-details-st.service';
import { ConfirmComponent } from 'src/app/admin/shared/confirm/confirm.component';
// import { LscTableComponent } from '../item-details/lsc-table/lsc-table.component';



@Component({
    selector: 'app-items-table',
    templateUrl: './items-table.component.html',
    styleUrls: ['./items-table.component.scss']
})
export class ItemsTableComponent implements OnInit {

    displayedItemColumns: string[] = ['name', 'delete', 'stats', 'qr code local', 'qr code', 'details'];
    itemDataSource: MatTableDataSource<any>;
    @ViewChild('empTbSort') empTbSort = new MatSort();

    @Input() private venueId: string;
    items: Item[];
    items$: Observable<Item[]>;


    constructor(
        private itemDetailsDbService: ItemDetailsDbService,
        private itemDetailsStService: ItemDetailsStService,
        private dialog: MatDialog,
        private router: Router,
        private snackbar: MatSnackBar,
        public afAuth: Auth,
        private store: Store<fromAdmin.AdminState>

    ) { }

    ngOnInit(): void {
        console.log(this.venueId)
        this.store.select(fromAdmin.getItems).subscribe((items: Item[]) => {
            this.itemDataSource = new MatTableDataSource(items)
        })

        // TODO
        // .subscribe((items: Item[]) => {
        //     this.items = items;
        //     this.itemDataSource = new MatTableDataSource(items)
        // })
    }


    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.itemDataSource.filter = filterValue.trim().toLowerCase();
    }
    onQrCodeLocal(itemId: string) {
        this.router.navigate(['/admin/qr-code', { venueId: this.venueId, itemId, local: true }])
    }

    onQrCode(itemId: string) {
        // console.log(itemId)
        this.router.navigate(['/admin/qr-code', { venueId: this.venueId, itemId }])
    }
    onItemStats(itemId) {
        this.router.navigate(['admin/item-stats', { venueId: this.venueId, itemId }])
        this.itemDetailsDbService.readItemVisits(this.venueId, itemId)
    }
    onDeleteItem(itemId) {
        console.log(itemId)
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: `This will remove the complete item, including the imageFile and all languages, including the name, description and audioFile`
            }
        })
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.itemDetailsDbService.deleteItem(this.venueId, itemId)
            } else {
                // this.snackbar.open(`deletion ${itemId} aborted`, 'OK')
            }
        })


        return;

        // TODO: DELETE ALL LSCS

    }
    onItemDetails(venueId: string, itemId: string) {
        console.log(venueId, itemId)
        this.itemDetailsDbService.readItem(venueId, itemId)

        this.itemDetailsDbService.getLscsByItem(venueId, itemId)
            .subscribe((lsSContent: LSContent[]) => {
                const newLsSC: LSContent[] = { ...lsSContent }
                this.store.dispatch(new Admin.SetLanguagesSpecificContent(lsSContent))
            })

        this.router.navigate(['/admin/item-details',
            {
                venueId: this.venueId, itemId
            }
        ])
    }
}
