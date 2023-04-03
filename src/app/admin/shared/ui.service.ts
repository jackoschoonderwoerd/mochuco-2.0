import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from './confirm/confirm.component';

@Injectable({
    providedIn: 'root'
})
export class UiService {

    constructor(
        // private snackbar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    // confirm(message: string) {
    //     const dialogRef = this.dialog.open(ConfirmComponent, {
    //         data: {
    //             message
    //         }
    //     })
    //     return dialogRef.afterClosed().subscribe(res => {
    //         if (res) {
    //             console.log(res)
    //             return true;
    //         } else {
    //             console.log(res)
    //             return false
    //         }
    //     })
    // }
}
