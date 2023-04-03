import { Component, Input, OnInit } from '@angular/core';
import { ItemDetailsDbService } from '../item-details-db.service';
import { LSContent } from '../../../../../shared/item.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../shared/confirm/confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrPageComponent } from '../../../../shared/err-page/err-page.component';
import { ItemDetailsStService } from '../item-details-st.service';
import { MatTableDataSource } from '@angular/material/table';



@Component({
    selector: 'app-lsc-table',
    templateUrl: './lsc-table.component.html',
    styleUrls: ['./lsc-table.component.scss']
})
export class LscTableComponent implements OnInit {


    displayedLscColumns: string[] = ['language', 'name', 'description', 'audioUrl', 'edit', 'delete']
    lscDataSource: MatTableDataSource<any>

    @Input() private venueId: string;
    @Input() private itemId: string
    lscs: LSContent[]

    // displayedColumns: string[] = ['language', 'name', 'description', ' audioUrl']
    // dataSource;



    constructor(
        private itemDetailsDbService: ItemDetailsDbService,
        private itemDetailsStService: ItemDetailsStService,
        private router: Router,
        private dialog: MatDialog,
        private snackbar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.itemDetailsDbService.getLanguagesSpecificContentByItemId(this.venueId, this.itemId)
            .subscribe((lscs: LSContent[]) => {
                this.lscs = lscs;
                this.lscDataSource = new MatTableDataSource(lscs);
            })
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        console.log(filterValue)
        this.lscDataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.lscDataSource)
    }

    onEditLsc(language: string) {
        this.router.navigate(['/admin/item-lsc-details', { venueId: this.venueId, itemId: this.itemId, language }])
    }
    onDeleteLsc(language: string, audioUrl: string) {

        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'this will permanently remove the selected lsc'
            }
        })
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                if (audioUrl) {
                    this.itemDetailsStService.deleteAudioFileAndUpdateUrl(this.venueId, this.itemId, language)
                        .then((res: any) => {
                            this.snackbar.open('audio file removed from storage', null, {
                                duration: 5000
                            })
                        })
                        .catch(err => {
                            this.snackbar.open(`removing audiofile form storage failed err: ${err}`, null, {
                                duration: 5000
                            })
                        })
                }
                this.itemDetailsDbService.deleteLSC(this.venueId, this.itemId, language)
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
}
