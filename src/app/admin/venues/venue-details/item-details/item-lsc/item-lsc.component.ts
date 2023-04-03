import { Component, Input } from '@angular/core';
import { LSContent } from 'src/app/shared/item.model';
import { Router } from '@angular/router';
import { ItemDetailsDbService } from '../item-details-db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ErrPageComponent } from '../../../../shared/err-page/err-page.component';
import { ConfirmComponent } from '../../../../shared/confirm/confirm.component';

@Component({
    selector: 'app-item-lsc',
    templateUrl: './item-lsc.component.html',
    styleUrls: ['./item-lsc.component.scss']
})
export class ItemLscComponent {
    @Input() public lsc: LSContent;
    @Input() public venueId: string
    @Input() public itemId: string;


    constructor(
        private router: Router,
        private itemDetailsDbService: ItemDetailsDbService,
        private snackbar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    onDeleteLsc() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'this will permanently remove the selected lsc'
            }
        })
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.itemDetailsDbService.deleteLSC(this.venueId, this.itemId, this.lsc.language)
                    .then((res: any) => {
                        this.snackbar.open('lsc deleted', null, {
                            duration: 5000
                        })
                    })
                    .catch(err => {
                        this.dialog.open(ErrPageComponent, {
                            data: {
                                message: 'failed to delete lsc'
                            }
                        })
                    })
            }
        })
    }

    onLscDetails() {
        this.router.navigate(['/admin/item-lsc-details', {
            venueId: this.venueId,
            itemId: this.itemId,
            language: this.lsc.language
        }])
    }

}
