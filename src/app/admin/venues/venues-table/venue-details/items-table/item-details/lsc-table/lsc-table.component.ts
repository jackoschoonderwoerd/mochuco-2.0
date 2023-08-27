import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
// import { ItemDetailsDbService } from '../../../../services/item-details-db.service';
// import { LSContent } from '../../../../../shared/item.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// import { ConfirmComponent } from '../../../../shared/confirm/confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { ErrPageComponent } from '../../../../shared/err-page/err-page.component';
// import { ItemDetailsStService } from '../../../../services/item-details-st.service';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import * as fromAdmin from 'src/app/admin/store/admin.reducer'
import * as Admin from 'src/app/admin/store/admin.actions'
import { Observable } from 'rxjs';
import { LscService } from 'src/app/admin/services/lsc.service';
import { LSContent } from 'src/app/shared/item.model';
import { ConfirmComponent } from 'src/app/admin/shared/confirm/confirm.component';



@Component({
    selector: 'app-lsc-table',
    templateUrl: './lsc-table.component.html',
    styleUrls: ['./lsc-table.component.scss']
})
export class LscTableComponent implements OnInit, AfterViewInit {


    displayedLscColumns: string[] = ['language', 'name', 'description', 'audioUrl', 'edit', 'delete']
    lscDataSource: MatTableDataSource<any>


    @Input('itemId') private itemId: string;
    @Input('venueId') private venueId: string;
    lsSC: LSContent[]
    lsSC$: Observable<LSContent[]>


    // displayedColumns: string[] = ['language', 'name', 'description', ' audioUrl']
    // dataSource;



    constructor(

        private router: Router,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private store: Store,
        private lscService: LscService
    ) { }

    ngOnInit(): void {
        this.lsSC$ = this.store.select(fromAdmin.getLanguages)
        // console.log(this.venueId, this.itemId)
        // this.itemDetailsDbService.getLscsByItem(this.venueId, this.itemId)
        //     .subscribe((lscs: LSContent[]) => {
        //         this.lscs = lscs;
        //         this.lscDataSource = new MatTableDataSource(lscs);
        //     })
        this.store.select(fromAdmin.getLanguages).subscribe((languages: LSContent[]) => {
            // console.log(lscs)
            this.lscDataSource = new MatTableDataSource(languages);
        })
    }
    ngAfterViewInit(): void {
        // this.store.select(fromAdmin.getItemAvailableLanguages).subscribe((lscs: LSContent[]) => {
        //     this.lscDataSource = new MatTableDataSource(lscs);
        // })
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        // console.log(filterValue)
        this.lscDataSource.filter = filterValue.trim().toLowerCase();
        // console.log(this.lscDataSource)
    }

    onLscDetails(language: string) {
        this.lscService.getLSCbyLanguage(this.venueId, this.itemId, language)
        this.router.navigate(['/admin/lsc-details', {
            venueId: this.venueId,
            itemId: this.itemId,
            editmode: true,
            language: language
        }
        ])
    }

    onDeleteLsc(language: string, audioUrl: string) {
        console.log(language)
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'this will permanently remove the selected lsc'
            }
        })
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                if (audioUrl) {
                    this.lscService.deleteAudioFileAndUpdateUrl(this.venueId, this.itemId, language)
                        .then((res: any) => {
                            this.snackbar.open('audio file removed from storage', 'OK', {

                            })
                        })
                        .catch(err => {
                            this.snackbar.open(`removing audiofile form storage failed err: ${err}`, 'OK', {

                            })
                        })
                }
                this.lscService.deleteLSC(this.venueId, this.itemId, language)
                // .then((res: any) => {
                //     this.snackbar.open(res, 'OK')
                // })

            }
        })
    }
}
