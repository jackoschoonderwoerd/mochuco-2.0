import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ItemDetailsDbService } from '../../../../../../services/item-details-db.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { Item, LSContent, Venue } from '../../../../../../../shared/item.model';
import { MatDialog } from '@angular/material/dialog';
import { ErrPageComponent } from 'src/app/admin/shared/err-page/err-page.component';

// import { VenuesService } from '../../../../../venues.service';
import * as fromAdmin from '../../../../../../../../store/admin.reducer'
import * as Admin from '../../../../../../../../store/admin.actions'
import { Store } from '@ngrx/store'
import { Observable, map, tap } from 'rxjs';
import { LscService } from 'src/app/admin/services/lsc.service';
import { Item, LSContent, Venue } from 'src/app/shared/item.model';
import { ItemDetailsDbService } from 'src/app/admin/services/item-details-db.service';
import { VenuesService } from 'src/app/admin/services/venues.service';
// import { State } from '../../../../../../store/admin.reducer';

@Component({
    selector: 'app-lsc-name',
    templateUrl: './lsc-name.component.html',
    styleUrls: ['./lsc-name.component.scss']
})
export class LscNameComponent implements OnInit {

    venueId: string;
    itemId: string;
    language: string;
    nameForm: FormGroup
    editmode: boolean = false;
    lsc: LSContent;
    item: Item;
    venue: Venue;
    venue$: Observable<Venue>
    item$: Observable<Item>
    lsc$: Observable<LSContent>;
    selectedLanguageName$: Observable<string>

    constructor(
        private route: ActivatedRoute,
        private itemDetailsDbService: ItemDetailsDbService,
        private venuesService: VenuesService,
        private fb: FormBuilder,
        private router: Router,
        private snackbar: MatSnackBar,
        private dialog: MatDialog,
        private store: Store<fromAdmin.AdminState>,
        private lscService: LscService,
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            console.log(params)
            this.venueId = params.venueId;
            this.itemId = params.itemId;
            this.language = params.language;
        })
        this.initNameForm()
        this.store.subscribe((storeData: any) => console.log(storeData));
        this.venue$ = this.store.select(fromAdmin.getVenue);
        this.item$ = this.store.select(fromAdmin.getItem);
        this.lsc$ = this.store.select(fromAdmin.getLanguage)
        this.selectedLanguageName$ = this.store.select(fromAdmin.getSelectedLanguageName);
    }

    initNameForm() {
        this.nameForm = this.fb.group({
            name: new FormControl(null, [Validators.required])
        })
        this.store.select(fromAdmin.getLanguage).subscribe((lsc: any) => {
            if (lsc) {
                this.editmode = true
                console.log(lsc)
                this.nameForm.patchValue({
                    name: lsc.name
                })
            }
        })
    }

    onAddLscName() {
        const name = this.nameForm.value.name;
        if (!this.editmode) {
            console.log('adding name')
            const lsc: LSContent = {
                name: name,
                language: this.language,
                description: null,
                audioUrl: null
            }
            console.log(
                this.venueId,
                this.itemId,
                this.language,
                lsc)

            this.lscService.addLscName(
                this.venueId,
                this.itemId,
                this.language,
                lsc)
        } else {
            console.log('updating name')
            this.lscService.udpdateLscName(this.venueId, this.itemId, this.language, name)
                .then(() => {
                    this.snackbar.open('name updated', null, {
                        duration: 5000
                    })
                    this.navigateToLscDetails()

                })

                .catch((err) => {
                    this.snackbar.open(err, 'OK', {

                    })
                    this.navigateToItem();
                })
        }
    }
    onCancel() {
        this.navigateToLscDetails()
    }
    navigateToItem() {
        this.router.navigate(['admin/item-details', {
            itemId: this.itemId,
            venueId: this.venueId,
            language: this.language
        }])
    }
    navigateToLscDetails() {
        this.router.navigate(['/admin/lsc-details', {
            itemId: this.itemId,
            venueId: this.venueId,
            language: this.language
        }])
    }
}
