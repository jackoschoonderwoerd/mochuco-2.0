import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LscService } from 'src/app/admin/services/lsc.service';

@Component({
    selector: 'app-language-options-dialog',
    templateUrl: './language-options-dialog.component.html',
    styleUrls: ['./language-options-dialog.component.scss']
})
export class LanguageOptionsDialogComponent implements OnInit {

    languageOptions: string[] = []
    constructor(
        private lscService: LscService,
        private dialogRef: MatDialogRef<LanguageOptionsDialogComponent>
    ) { }

    ngOnInit(): void {
        this.lscService.getAvailableLanguages()
        this.languageOptions = ['dutch', ' english', 'german']
        // .then((languageOptions: string[]) => {
        //     this.languageOptions = languageOptions
        // })
    }
    languageSelected(language: string) {

        console.log(language);
        this.dialogRef.close(language)
    }
    onCancel() {
        this.dialogRef.close(null)
    }
}
