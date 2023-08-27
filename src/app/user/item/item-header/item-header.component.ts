import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Venue, Item } from 'src/app/shared/item.model';

import { Store } from '@ngrx/store';
import * as fromApp from './../../../app.reducer'

@Component({
    selector: 'app-item-header',
    templateUrl: './item-header.component.html',
    styleUrls: ['./item-header.component.scss']
})
export class ItemHeaderComponent implements OnInit {

    mainItemActive: boolean = false;
    venueId: string;
    itemId: string;
    previousItemId: string;
    previousLanguage: string

    constructor(
        public itemService: ItemService,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<fromApp.State>
    ) { }

    @Output() showAbout: EventEmitter<void> = new EventEmitter()


    ngOnInit(): void {

    }

    onMochucoLogo() {
        this.showAbout.emit();
    }

    onVenueLogo() {
        if (!this.mainItemActive) {
            this.storePreviousItemId();

            this.itemService.getMainiItemId()
                .then((mainItemId: string) => {
                    // console.log(mainItemId)
                    this.itemService.getVenueId()
                        .then((venueId: string) => {
                            this.itemService.setObservables(venueId, mainItemId)
                        })
                        .then(() => {
                            this.mainItemActive = true
                        })

                })
        } else {
            this.mainItemActive = false
            this.itemService.getVenueId()
                .then((venueId: string) => {
                    this.itemService.setObservables(venueId, this.previousItemId);
                })
        }

        // if (!this.mainItemActive) {
        //     this.storePreviousItemId();
        //     this.itemService.setMainItem()
        //     this.mainItemActive = true;
        // }
        // else {
        //     console.log(this.previousItemId)
        //     this.setPreviousItem()
        // }
    }


    private storePreviousItemId() {
        const sub = this.itemService.item$.subscribe((activeItem: Item) => {
            if (activeItem) {
                this.previousItemId = activeItem.id
                // console.log(this.previousItemId)
                // this.itemService.activeLanguage$.subscribe((language: string) => {
                //     this.previousLanguage = language;
                // })
            } else {
                // console.log('EITHER MAINITEM OR no active item')
            }
        })
        sub.unsubscribe();
        const langguageSub = this.itemService.activeLanguage$.subscribe((language: string) => {
            // console.log(language);
            this.previousLanguage = language;
        })
        langguageSub.unsubscribe()
    }
    private setPreviousItem() {
        this.itemService.venue$.subscribe((venue: Venue) => {
            // console.log(venue.id);
            this.mainItemActive = false;
            this.itemService.setItemObservable(venue.id, this.previousItemId);
            this.itemService.setLscObservable(venue.id, this.previousItemId);
            this.itemService.setActiveLanguage(this.previousLanguage);
        })
    }
}

