
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ConfirmComponent>
    ) { }

    ngOnInit(): void {
        // console.log(this.data);
    }
    onConfirm() {
        this.dialogRef.close(true)
    }
    onCancel() {
        this.dialogRef.close(false)
    }
}