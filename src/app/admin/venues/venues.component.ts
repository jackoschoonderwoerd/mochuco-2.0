import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromAdmin from '../store/admin.reducer';
import * as Admin from '../store/admin.actions'
import { Venue } from 'src/app/shared/item.model';
import { Auth } from '@angular/fire/auth';


@Component({
    selector: 'app-venues',
    templateUrl: './venues.component.html',
    styleUrls: ['./venues.component.scss']
})
export class VenuesComponent implements OnInit {

    // venues$: Observable<Venue[]>

    constructor(

        private router: Router,
        private store: Store,
        private afAuth: Auth
    ) { }

    ngOnInit(): void {

    }

    onAddVenue() {
        const venue: Venue = {
            ownerId: this.afAuth.currentUser.uid,
            venueName: ''
        }
        this.store.dispatch(new Admin.SetVenue(venue))
        this.store.dispatch(new Admin.SetItems([]))
        this.store.dispatch(new Admin.SetItem(null))
        this.store.dispatch(new Admin.SetLanguagesSpecificContent([]))
        this.store.dispatch(new Admin.SetLanguageSpecificContent(null))
        this.router.navigate(['admin/venue-details'])
    }
}
