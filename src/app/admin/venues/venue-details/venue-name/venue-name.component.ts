import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Venue, VenuesService } from '../../venues.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ErrPageComponent } from '../../../shared/err-page/err-page.component';
import { Auth } from '@angular/fire/auth';

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

    constructor(
        private route: ActivatedRoute,
        private venuesService: VenuesService,
        private fb: FormBuilder,
        private snacbar: MatSnackBar,
        private router: Router,
        private dialog: MatDialog,
        private afAuth: Auth

    ) { }

    ngOnInit(): void {
        this.initVenueNameForm()
        this.route.params.subscribe((params: any) => {
            const venueId = params.venueId;
            if (venueId) {
                this.venuesService.readVenue(venueId)
                    .subscribe((venue: Venue) => {
                        if (venue) {
                            this.editmode = true
                            this.venue = venue;
                            this.venueNameForm.patchValue({
                                name: venue.venueName
                            })
                        }
                    })
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
                    console.log(docRef)
                    this.snacbar.open('Venue added', null, {
                        duration: 5000
                    })
                    this.router.navigate(['/admin/venue-details', { venueId: docRef.id }]);
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
