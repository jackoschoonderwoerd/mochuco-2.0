import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';


import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog } from '@angular/material/dialog';

import { LscService } from 'src/app/admin/services/lsc.service';
import { LSContent } from 'src/app/shared/item.model';

import { ItemDetailsDbService } from 'src/app/admin/services/item-details-db.service';
// import { ItemDetailsStService } from '../../../../../../../../services/item-details-st.service';
import { ConfirmComponent } from 'src/app/admin/shared/confirm/confirm.component';
import { ItemDetailsStService } from 'src/app/admin/services/item-details-st.service';

@Component({
    selector: 'app-lsc-audio',
    templateUrl: './lsc-audio.component.html',
    styleUrls: ['./lsc-audio.component.scss']
})
export class ItemLscAudioComponent implements OnInit {
    // @Input() public item: Item;
    @Input() public itemId: string;
    @Input() public venueId: string;
    @Input() public languageName: string;
    @Input() public itemAudioUrl: string;
    audioUrl: string;
    language: LSContent;

    @Output() public audioUrlEmitter = new EventEmitter<string>

    constructor(

        private snackBar: MatSnackBar,
        private itemDetailsStService: ItemDetailsStService,

        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private itemDetailsDbService: ItemDetailsDbService,
        private lscService: LscService
    ) {

    }

    ngOnInit(): void {
        // console.log(this.itemId)
        // console.log(this.venueId)
        // console.log(this.language)
        this.itemDetailsDbService.getAudioByLanguage(this.venueId, this.itemId, this.languageName)
            .subscribe((language: LSContent) => {
                this.language = language
            });

    }

    audioSelected(e) {
        const audioFile: File = e.target.files[0]
        // console.log(e.target.files[0])
        this.itemDetailsStService.storeAudio(this.venueId, this.itemId, this.languageName, audioFile)
            .then((audioUrl) => {
                this.snackBar.open('audiofile stored', null, {
                    duration: 5000
                });

                this.itemDetailsDbService.updateItemAudioUrl(
                    this.venueId,
                    this.itemId,
                    this.languageName,
                    audioUrl
                )
                    .then((res) => {
                        this.snackBar.open('audio url updated', null, {
                            duration: 5000
                        })
                    })
                    .catch(err => {
                        this.snackbar.open(err, null, {
                            duration: 5000
                        })
                    })
                // this.audioUrlEmitter.next(url)
            })
            .catch((err) => {
                this.snackBar.open('unable to store audio file')
            })
    }

    onDeleteAudioUrl() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'This wille permanently delete the audio file'
            }
        })
        dialogRef.afterClosed().subscribe((res) => {
            this.language.audioUrl = null;
            this.lscService.deleteAudioFileAndUpdateUrl(this.venueId, this.itemId, this.languageName)
                .then((res) => {
                    this.snackBar.open('audio file deleted, audioUrl updated to null', null, {
                        duration: 5000
                    })
                    // this.itemDetailDbService.updateItemAudioUrl(this.venueId, this.itemId, this.language, null)
                    //     .then((res) => {
                    //         this.snackBar.open('audioUrl to null', null, {
                    //             duration: 5000
                    //         })
                    //     })
                    //     .catch((err) => {
                    //         this.snackBar.open('unable to update audioUrl', null, {
                    //             duration: 5000
                    //         })
                    //     })
                })
                .catch((err) => {
                    this.snackBar.open('audio file deletion unsuccessful', null, {
                        duration: 5000
                    });
                })
        })

    }
}
