import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { ItemDetailsDbService } from '../../../../../../services/item-details-db.service';
// import { Item, LSContent, Venue, } from '../../../../../../../shared/item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VenuesService } from 'src/app/admin/services/venues.service';
import * as fromAdmin from 'src/app/admin/store/admin.reducer';
// import * as Admin from './../../../../../../admin.actions';
import { Store } from '@ngrx/store';
import { LscService } from 'src/app/admin/services/lsc.service';
import { Observable } from 'rxjs';
import { Item, LSContent, Venue } from 'src/app/shared/item.model';
import { ItemDetailsDbService } from 'src/app/admin/services/item-details-db.service';

@Component({
    selector: 'app-item-description',
    templateUrl: './lsc-description.component.html',
    styleUrls: ['./lsc-description.component.scss']
})
export class LscDescriptionComponent implements OnInit, AfterViewInit {

    venueId: string;
    itemId: string;
    language: string
    descriptionForm: FormGroup
    editmode: boolean = false;
    lsc: LSContent;
    lsc$: Observable<LSContent>
    @ViewChild('textarea') private textarea: ElementRef;
    description: string;
    submitDisabled: boolean = false;
    textAreaHeight;
    prefacemode: boolean = false;
    venue: Venue;
    item: Item;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private itemDetailDbService: ItemDetailsDbService,
        private snackbar: MatSnackBar,
        private venuesService: VenuesService,
        private store: Store<fromAdmin.AdminState>,
        private lscService: LscService,

    ) { }

    ngOnInit(): void {
        this.initDescriptionForm();
        this.route.params.subscribe((params: any) => {
            this.venueId = params.venueId;
            this.itemId = params.itemId;
            this.language = params.language
        })
        console.log(this.venueId, this.itemId, this.language)
        // TODO UPDATE TEXTAREAHEIGHT
        this.lsc$ = this.store.select(fromAdmin.getLanguage)
        this.store.select(fromAdmin.getLanguage).subscribe((lsc: LSContent) => {
            if (!lsc) {
                this.editmode = false
                this.lsc = {
                    language: this.language,
                }
            } else {
                this.lsc = { ...lsc }
                this.description = lsc.description;
                if (lsc.description) {
                    this.descriptionForm.patchValue({
                        description: lsc.description
                    })
                }
            }
        })
        this.store.select(fromAdmin.getVenue).subscribe((venue: Venue) => {
            this.venue = venue;
        })
        this.store.select(fromAdmin.getItem).subscribe((item: Item) => {
            this.item = item
        })

    }

    ngAfterViewInit(): void {
        this.textarea.nativeElement.style.height = '500px';

    }

    initDescriptionForm() {
        this.descriptionForm = this.fb.group({
            description: new FormControl(null, [Validators.required])
        })
    }

    addHeader() {
        const cursorStart = this.textarea.nativeElement.selectionStart;
        const cursorEnd = this.textarea.nativeElement.selectionEnd;
        // console.log(cursorStart, cursorEnd)
        let currentValue = this.textarea.nativeElement.value;
        let patchedValue = currentValue.substr(
            0, cursorStart) +
            '\n<h5>YOUR HEADER</h5>\n' +
            currentValue.substr(cursorEnd
            )
        this.textarea.nativeElement.value = patchedValue;
        this.description = patchedValue.replace(

            /(?!.*<br>)(?!.*<p>)(?!.*<\/p>)(?!.*<h5>)(?!.*<\/h5>)(<([^>]+)>)/ig, ''
        );
        // this.adjustTextareaHeight();
        // this.selectedAreaStart = 0;
        // this.selectedAreaEnd = 0;

        currentValue = null;
        this.setCaretPosition(cursorEnd, 21);
        // console.log(this.textarea.nativeElement.scrollHeight)
        // this.textarea.nativeElement.scrollHeight = '600px'
        let el = this.textarea.nativeElement
        this.textareaKeyUp('')
        // el.setAttribute('style', 'height:600px')
    }
    addParagraph() {
        const cursorStart = this.textarea.nativeElement.selectionStart;
        const cursorEnd = this.textarea.nativeElement.selectionEnd;
        // console.log(cursorStart, cursorEnd)
        let currentValue = this.textarea.nativeElement.value;
        let patchedValue = currentValue.substr(
            0, cursorStart) +
            '\n<p>YOUR PARAGRAPH</p>\n' +
            currentValue.substr(cursorEnd)
        this.textarea.nativeElement.value = patchedValue;
        this.description = patchedValue.replace(

            /(?!.*<br>)(?!.*<p>)(?!.*<\/p>)(?!.*<h5>)(?!.*<\/h5>)(<([^>]+)>)/ig, ''
        );
        this.onKeyup('')

        // this.selectedAreaStart = 0;
        // this.selectedAreaEnd = 0;

        currentValue = null;
        this.setCaretPosition(cursorEnd, 22)
    }
    addLineBreak() {
        // console.log('adding linebreak')
        const cursorStart = this.textarea.nativeElement.selectionStart;
        // console.log(cursorStart)
        const cursorEnd = this.textarea.nativeElement.selectionEnd;
        // console.log(cursorEnd)
        let currentValue = this.textarea.nativeElement.value;
        let patchedValue = currentValue.substr(
            0, cursorStart) +
            '<br>\n' +
            currentValue.substr(cursorEnd)
        this.textarea.nativeElement.value = patchedValue;
        this.description = patchedValue.replace(
            /(?!.*<br>)(?!.*<p>)(?!.*<\/p>)(?!.*<h5>)(?!.*<\/h5>)(<([^>]+)>)/ig, ''
        );
        this.setCaretPosition(cursorEnd, 4)
        // this.textarea.nativeElement.setSelectionRange()
    }



    onKeyup(e) {

        console.log(this.descriptionForm.value.description)
        this.lsc.description = this.descriptionForm.value.description;
    }

    textareaKeyUp(event) {
        console.log(event)
        if (event.code === 'Enter') {
            this.addLineBreak()
        }

        this.description = this.textarea.nativeElement.value.replace(
            /(?!.*<br>)(?!.*<p>)(?!.*<\/p>)(?!.*<h5>)(?!.*<\/h5>)(<([^>]+)>)/ig, ''
        );
        this.adjustTextareaHeight();
        this.onCheckForHeaderLength()
    }
    textAreaChanged() {
        this.description = this.textarea.nativeElement.value.replace(
            /(?!.*<br>)(?!.*<p>)(?!.*<\/p>)(?!.*<h5>)(?!.*<\/h5>)(<([^>]+)>)/ig, ''
        );
        this.adjustTextareaHeight();
        this.onCheckForHeaderLength()
    }

    private adjustTextareaHeight() {

        // this.descriptionForm.valueChanges.subscribe(value => {
        //     console.log('change detected')
        //     this.textarea.nativeElement.style.height = `${this.textarea.nativeElement.scrollHeight}px`
        //     this.textarea.nativeElement.style.height = 'auto';
        // })

    }

    private onCheckForHeaderLength() {
        var indicesH5start = [];
        var indicesH5end = [];
        var indices = [];
        var tagsInvalid: boolean = false;
        var tagsToLong: boolean = false;
        for (var pos = this.description.indexOf('<h5>'); pos !== -1; pos = this.description.indexOf('<h5>', pos + 1)) {
            indicesH5start.push(pos);
            indices.push(pos);
        }
        for (var pos = this.description.indexOf('</h5>'); pos !== -1; pos = this.description.indexOf('</h5>', pos + 1)) {
            indicesH5end.push(pos);
            indices.push(pos);
        }
        if (indicesH5start.length != indicesH5end.length) {
            tagsInvalid = true
            alert('open h5 tag')
        } else {

        }
        for (let i = 0; i < indicesH5start.length; i++) {
            if (indicesH5end[i] - indicesH5start[i] > 50) {
                tagsToLong = true
                alert('a header can contain a maximum of 50 characters')
            } else {

            }
        }
        if (tagsInvalid || tagsToLong) {
            this.submitDisabled = true;
        } else {
            this.submitDisabled = false;
        }

    }

    onAddDescription() {
        this.lscService.updateLscDescription(
            this.venueId,
            this.itemId,
            this.language,
            this.lsc.description
        )
        // .then((res) => {
        //     this.snackbar.open('description updated', 'OK', {
        //         // duration: 5000
        //     })
        //     // this.router.navigate(['admin/item-details', { venueId: this.venueId, itemId: this.itemId }])
        //     this.navigateToLscDetails()
        // })
        // .catch((err) => {
        //     this.snackbar.open(`updating description failes, ${err}`, 'OK', {
        //         // duration: 5000
        //     })
        //     // this.router.navigate(['admin/item-details', { venueId: this.venueId, itemId: this.itemId }])
        //     this.navigateToLscDetails()
        // })
    }

    onCancel() {
        this.navigateToLscDetails()
        // this.router.navigate(['admin/lsc-details', {
        //     venueId: this.venueId,
        //     itemId: this.itemId }])
    }

    navigateToLscDetails() {
        this.router.navigate(['/admin/lsc-details', {
            itemId: this.itemId,
            venueId: this.venueId,
            language: this.lsc.language
        }])
    }

    private setCaretPosition(cursorEnd, addedPositions) {
        console.log(cursorEnd);
        if (this.textarea.nativeElement.setSelectionRange) {
            this.textarea.nativeElement.focus();
            this.textarea.nativeElement.setSelectionRange(cursorEnd + addedPositions, cursorEnd + addedPositions);
        }
    }
}
