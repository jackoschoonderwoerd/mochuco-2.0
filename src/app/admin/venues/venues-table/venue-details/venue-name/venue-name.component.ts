import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { VenuesService } from '../../venues.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
// import { ErrPageComponent } from '../../../shared/err-page/err-page.component';
import { Auth } from '@angular/fire/auth';
import * as fromAdmin from 'src/app/admin/store/admin.reducer';
import * as Admin from 'src/app/admin/store/admin.actions';
import { Store } from '@ngrx/store'
import { Venue } from 'src/app/shared/item.model';
import { Observable } from 'rxjs';
import { VenuesService } from 'src/app/admin/services/venues.service';
import { ErrPageComponent } from 'src/app/admin/shared/err-page/err-page.component';

@Component({
    selector: 'app-venue-name',
    templateUrl: './venue-name.component.html',
    styleUrls: ['./venue-name.component.scss']
})
export class VenueNameComponent implements OnInit {

    venueId: string;
    venue: Venue;
    venueNameForm: FormGroup
    editmode: boolean = false
    venue$: Observable<Venue>

    constructor(
        private route: ActivatedRoute,
        private venuesService: VenuesService,
        private fb: FormBuilder,
        private snacbar: MatSnackBar,
        private router: Router,
        private dialog: MatDialog,
        private afAuth: Auth,
        private store: Store<fromAdmin.AdminState>

    ) { }

    ngOnInit(): void {
        this.store.subscribe(storeData => console.log(storeData))
        this.initVenueNameForm()
        this.route.params.subscribe((params: any) => {
            const venueId = params.venueId;
            if (venueId) {
                this.store.select(fromAdmin.getVenue).subscribe((venue: Venue) => {
                    if (venue) {
                        this.editmode = true;
                        this.venue = venue
                        this.venueNameForm.patchValue({
                            name: venue.venueName
                        })
                    }
                })
                // this.venuesService.readVenue(venueId)
                // .subscribe((venue: Venue) => {
                //     if (venue) {
                //         this.editmode = true
                //         this.venue = venue;
                //         this.venueNameForm.patchValue({
                //             name: venue.venueName
                //         })
                //     }
                // })
            }
        })
    }

    initVenueNameForm() {
        this.venueNameForm = this.fb.group({
            name: new FormControl(null, [Validators.required])
        })
    }
    onUpdateName() {
        const venueName = this.venueNameForm.value.name
        const ownerId = this.afAuth.currentUser.uid
        if (!this.editmode) {
            const venue: Venue = {
                venueName,
                ownerId
            }
            this.venuesService.createVenue(venue)
                .then(docRef => {
                    venue.id = docRef.id
                    this.store.dispatch(new Admin.SetVenue(venue))
                    this.snacbar.open('Venue added', 'OK')
                    this.router.navigate(['/admin/venue-details', { venueId: venue.id }]);
                })
                .catch(err => {
                    this.dialog.open(ErrPageComponent, {
                        data: {
                            message: 'Adding venue failed',
                            error: err
                        }
                    })
                })

        } else {
            this.venuesService.updateVenueName(this.venue.id, venueName)
                .then((res) => {
                    this.snacbar.open('venue name updated', 'OK');
                    this.navigateToItemDetails()
                })
                .catch((err) => {
                    this.snacbar.open(`Unable to update venue name; ${err}`, 'OK');
                    this.navigateToItemDetails()
                })
        }
    }

    onCancel() {
        if (this.venue) {
            this.navigateToItemDetails();
        } else {
            this.router.navigate(['/admin/venues'])
        }
    }
    navigateToItemDetails() {
        this.router.navigate(['/admin/venue-details', { venueId: this.venue.id }])
    }
}
