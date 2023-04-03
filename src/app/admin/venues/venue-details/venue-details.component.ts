import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Venue, VenuesService } from '../venues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth/auth.service';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { Item } from 'src/app/shared/item.model';
import { WarningComponent } from '../../shared/warning/warning.component';
import { ItemDetailsDbService } from './item-details/item-details-db.service';
// import { NewVenueService } from '../new-venue.service.tsXXX';
import { UiService } from '../../shared/ui.service';
import { ItemDetailsComponent } from './item-details/item-details.component';

@Component({
    selector: 'app-venue-details',
    templateUrl: './venue-details.component.html',
    styleUrls: ['./venue-details.component.scss']
})
export class VenueDetailsComponent implements OnInit {

    venue$: Observable<Venue>
    form: FormGroup;
    editmode: boolean = false;
    venue: Venue;
    items: Item[];
    logoSrc: any;
    logoUrl: string = '';
    logoChanged: boolean = false;
    logoSpinnerOn: boolean = false
    imageFile: File;



    constructor(
        private dialog: MatDialog,
        public venuesService: VenuesService,
        public route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private authService: AuthService,
        private afAuth: Auth,
        private itemDetailsDbService: ItemDetailsDbService,
        // private newVenueService: NewVenueService,
        private uiService: UiService) { }

    ngOnInit(): void {
        this.initForm()
        this.route.params.subscribe((params: any) => {
            const venueId = params.venueId;
            if (venueId) {
                console.log(venueId)
                this.venuesService.readVenue(venueId)
                    .subscribe((venue: Venue) => {
                        if (venue) {
                            // console.log(venue)
                            this.venue = venue;
                            this.editmode = true;
                            this.form.patchValue({
                                venueName: venue.venueName
                            })
                        }
                    })
                const subscription = this.itemDetailsDbService.readItems(venueId).subscribe((items: Item[]) => {
                    this.items = items
                    console.log(this.items)
                })
                subscription.unsubscribe();
            }
        })
    }
    onEditName() {
        if (!this.editmode) {
            this.router.navigate(['/admin/venue-name'])
        } else {
            this.router.navigate(['/admin/venue-name', { venueId: this.venue.id }])
        }
    }
    initForm() {
        this.form = this.fb.group({
            venueName: new FormControl(null, [Validators.required])
        })
    }
    onFileSelected(e) {
        const filename = e.target.files[0].name;
        const ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        if (ext !== 'jpg' && ext !== 'png' && ext !== 'jpeg' && ext !== 'webp' && ext !== 'svg') {
            this.dialog.open(WarningComponent, { data: { message: 'wrong filetype, only files with a name ending on \'jpg\' or \'png\' or \'webp\' of \'svg\' are allowed' } })
            return false;
        } else {
            this.logoSpinnerOn = true;
            this.imageFile = e.target.files[0]
            this.venuesService.updateVenueLogoStorage(this.venue.id, this.imageFile)
                .then((logoUrl) => {
                    this.logoUrl = logoUrl
                    this.venue.logoUrl = logoUrl;
                    this.snackBar.open('logo stored')
                    this.venuesService.updateVenueLogoUrl(this.venue.id, logoUrl)
                        .then((res) => {
                            this.snackBar.open('venue logo url updated', null, {
                                duration: 5000
                            });
                        })
                    this.logoSpinnerOn = false
                })
        }
    }
    onDeleteLogo() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                messeage: 'This will delete the logo image file from ST and the logo image url from DB'
            }
        })
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.venuesService.updateVenueLogoStorage(this.venue.id, null)
                    // this.venuesService.updateVenueLogoStorage('123', null)
                    .then(res => {
                        if (res) {
                            this.snackBar.open('Venue logo deleted', null, {
                                duration: 5000
                            })
                        } else {
                            this.snackBar.open('Deletion venue logo form storage failed', 'OK')
                        }
                    })
                    .catch(err => {
                        this.snackBar.open(err, 'OK')
                    })
            }
        })
    }



    onCreateItem() {
        this.router.navigate(['admin/new-item', {
            venueId: this.venue.id
        }])
    }

    onBackToVenues() {
        this.router.navigate(['/admin/venues'])
    }
}
