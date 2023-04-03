import { Component, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-err-page',
    templateUrl: './err-page.component.html',
    styleUrls: ['./err-page.component.scss']
})
export class ErrPageComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ErrPageComponent>
    ) { }
    onClose() {
        this.dialogRef.close();
    }
}
