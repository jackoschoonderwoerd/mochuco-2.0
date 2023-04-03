import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Item, LSContent } from '../../../../../../../shared/item.model';
import { ItemDetailsStService } from '../../../item-details-st.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemDetailsDbService } from '../../../item-details-db.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../../shared/confirm/confirm.component';

@Component({
    selector: 'app-item-audio',
    templateUrl: './item-lsc-audio.component.html',
    styleUrls: ['./item-lsc-audio.component.scss']
})
export class ItemLscAudioComponent implements OnInit {
    // @Input() public item: Item;
    @Input() public itemId: string;
    @Input() public venueId: string;
    @Input() public language: string;
    @Input() public itemAudioUrl: string;
    audioUrl: string;
    lsc: LSContent;

    @Output() public audioUrlEmitter = new EventEmitter<string>

    constructor(
        private itemDetailStService: ItemDetailsStService,
        private snackBar: MatSnackBar,
        private itemDbDetailsService: ItemDetailsDbService,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private itemDetailDbService: ItemDetailsDbService
    ) {

    }

    ngOnInit(): void {
        console.log(this.itemId)
        console.log(this.venueId)
        console.log(this.language)
        this.itemDbDetailsService.getAudioByLanguage(this.venueId, this.itemId, this.language)
            .subscribe((lsc: LSContent) => {
                this.lsc = lsc
            });

    }

    audioSelected(e) {
        const audioFile: File = e.target.files[0]
        console.log(e.target.files[0])
        this.itemDetailStService.storeAudio(this.venueId, this.itemId, this.language, audioFile)
            .then((audioUrl) => {
                this.snackBar.open('audiofile stored', null, {
                    duration: 5000
                });

                this.itemDbDetailsService.updateItemAudioUrl(
                    this.venueId,
                    this.itemId,
                    this.language,
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
            this.lsc.audioUrl = null;
            this.itemDetailStService.deleteAudioFileAndUpdateUrl(this.venueId, this.itemId, this.language)
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
