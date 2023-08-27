import { Component, OnInit } from '@angular/core';
import * as fromAdmin from '../admin.reducer'
import * as Admin from '../admin.actions'
import * as fromAuth from './../../auth/auth.reducer';
import { Store } from '@ngrx/store';
import { AdminState } from '../admin.reducer';
import { Observable } from 'rxjs';
import { Item, LSContent, Venue } from 'src/app/shared/item.model';
import { AdminEffects } from '../admin.effects';
import { Auth } from '@angular/fire/auth';

@Component({
    selector: 'app-window-store',
    templateUrl: './window-store.component.html',
    styleUrls: ['./window-store.component.scss']
})
export class WindowStoreComponent implements OnInit {

    store$: Observable<AdminState>
    venues$: Observable<Venue[]>
    venue$: Observable<Venue>
    venue: Venue
    items$: Observable<Item[]>
    item$: Observable<Item>
    lssc$: Observable<LSContent[]>
    lsc$: Observable<LSContent>
    isAdmin$: Observable<boolean>
    language: Observable<string>
    storeData: any

    constructor(
        private adminStore: Store<fromAdmin.AdminState>,
        private authStore: Store<fromAuth.AuthState>,
        private auth: Auth

    ) { }

    ngOnInit(): void {
        this.isAdmin$ = this.authStore.select(fromAuth.getIsAdmin)
        this.authStore.subscribe(data => console.log(data))
        this.adminStore.subscribe((storeData: any) => {
            this.storeData = storeData
            // console.log(storeData)
        })
        this.store$ = this.adminStore.select(fromAdmin.getCurrentState)
        this.venues$ = this.adminStore.select(fromAdmin.getVenues);
        this.venue$ = this.adminStore.select(fromAdmin.getVenue);
        this.items$ = this.adminStore.select(fromAdmin.getItems);
        this.item$ = this.adminStore.select(fromAdmin.getItem);
        this.lssc$ = this.adminStore.select(fromAdmin.getLanguages);
        this.lsc$ = this.adminStore.select(fromAdmin.getLanguage);
    }

    onClearVenues() {
        this.adminStore.dispatch(new Admin.SetVenues(null))
        console.log(`clearing venues`)
    }
    onClearVenue() {
        console.log(`clearing venue`)
        this.adminStore.dispatch(new Admin.SetVenue(null))
    }

    onClearItems() {
        this.adminStore.dispatch(new Admin.SetItems(null))
    }

    onClearItem() {
        this.adminStore.dispatch(new Admin.SetItem(null))
    }

    onClearLssc() {
        this.adminStore.dispatch(new Admin.SetLanguagesSpecificContent(null))
    }

    onClearLsc() {
        this.adminStore.dispatch(new Admin.SetLanguageSpecificContent(null))
    }


    onClearState() {
        this.onClearVenues();
        this.onClearVenue();
        this.onClearItems();
        this.onClearItem();
        this.onClearLssc();
        this.onClearLsc();
        localStorage.removeItem(`adminState`)
        // this.store.dispatch(new Admin.SetVenues(null));
        // this.store.dispatch(new Admin.SetVenue(null));
        // this.store.dispatch(new Admin.SetItems(null));
        // this.store.dispatch(new Admin.SetItem(null));
        // this.store.dispatch(new Admin.SetLanguagesSpecificContent(null));
        // this.store.dispatch(new Admin.SetLanguageSpecificContent(null));
    }
}
