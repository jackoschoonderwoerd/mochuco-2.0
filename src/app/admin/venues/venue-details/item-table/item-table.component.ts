import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ItemDetailsDbService } from '../item-details/item-details-db.service';
import { Item, LSContent } from '../../../../shared/item.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemDetailsStService } from '../item-details/item-details-st.service';
import { Auth } from '@angular/fire/auth';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
    selector: 'app-item-table',
    templateUrl: './item-table.component.html',
    styleUrls: ['./item-table.component.scss']
})
export class ItemTableComponent implements OnInit {

    displayedItemColumns: string[] = ['name', 'delete', 'stats', 'qr code local', 'qr code', 'details'];
    itemDataSource: MatTableDataSource<any>;
    @ViewChild('empTbSort') empTbSort = new MatSort();

    @Input() private venueId: string;
    items: Item[]

    constructor(
        private itemDetailsDbService: ItemDetailsDbService,
        private itemDetailsStService: ItemDetailsStService,
        private dialog: MatDialog,
        private router: Router,
        private snackbar: MatSnackBar,
        public afAuth: Auth

    ) { }

    ngOnInit(): void {
        this.itemDetailsDbService.readItems(this.venueId)
            .subscribe((items: Item[]) => {
                this.items = items;
                this.itemDataSource = new MatTableDataSource(items)
            })
    }


    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.itemDataSource.filter = filterValue.trim().toLowerCase();
    }
    onQrCodeLocal(itemId: string) {
        this.router.navigate(['/admin/qr-code', { venueId: this.venueId, itemId, local: true }])
    }

    onQrCode(itemId: string) {
        console.log(itemId)
        this.router.navigate(['/admin/qr-code', { venueId: this.venueId, itemId }])
    }
    onItemStats(itemId) {
        this.router.navigate(['admin/item-stats', { venueId: this.venueId, itemId }])
        this.itemDetailsDbService.readItemVisits(this.venueId, itemId)
    }
    onDeleteItem(itemId: string) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: `This will remove the complete item, including the imageFile and all languages, including the name, description and audioFile`
            }
        })
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                const subOne = this.itemDetailsDbService.getLanguagesSpecificContentByItemId(this.venueId, itemId)
                    .subscribe((lscs: LSContent[]) => {
                        console.log(lscs)
                        lscs.forEach((lsc: LSContent) => {
                            if (lsc.audioUrl) {
                                const subTwo = this.itemDetailsStService.deleteAudioFileAndUpdateUrl(this.venueId, itemId, lsc.language)
                                    .then((res) => {
                                        this.itemDetailsDbService.deleteLSC(this.venueId, itemId, lsc.language)
                                            .then((res) => {
                                                console.log(`lsc removed ${lsc.language}`)
                                            })
                                    })
                            } else {
                                this.itemDetailsDbService.deleteLSC(this.venueId, itemId, lsc.language)
                                    .then((res) => {
                                        console.log(`lsc removed ${lsc.language}`)

                                    })
                            }

                        })
                        this.itemDetailsStService.deleteItemImageFile(this.venueId, itemId)
                            .then((res) => {
                                this.snackbar.open(`item imagefile deleted ${itemId}`)
                                this.itemDetailsDbService.deleteItem(this.venueId, itemId)
                                    .then((res) => {
                                        console.log(`item ${itemId} removed`)
                                    })
                                    .catch((err) => {
                                        `removing item ${itemId} failed = ${err}`
                                    })
                            })
                        subOne.unsubscribe();
                    })
            } else {
                this.snackbar.open(`deletion ${itemId} aborted`, 'OK')
            }
        })

        // item.itemByLanguages.forEach((lsc: LSContent) => {
        //     console.log(lsc)
        // })

        return;

        // TODO: DELETE ALL LSCS

    }
    onDetails(itemId: string) {
        console.log(itemId)
        this.router.navigate(['/admin/item-details', { venueId: this.venueId, itemId }])
    }
}
