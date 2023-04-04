import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from './item.service';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {


    hideSidebar: boolean = true;
    venueId: string;
    itemId: string;
    activeLanguage: string;
    liked: boolean = false;
    hideAbout: boolean = true;

    constructor(
        private route: ActivatedRoute,
        public itemService: ItemService
    ) { }
    ngOnInit(): void {
        console.log('item.component.ts')
        this.route.queryParams.subscribe((params: any) => {
            this.venueId = params.venueId;
            this.itemId = params.itemId;
            console.log(this.venueId, this.itemId)
            if (this.venueId && this.itemId) {
                console.log('venueId and itemId present', this.venueId, this.itemId);
                this.itemService.setVenueObservable(this.venueId);
                this.itemService.setItemObservable(this.venueId, this.itemId);
                this.itemService.activeLanguage$.subscribe((activeLanguage: string) => {
                    console.log('called from ngOnInit item.component.ts')
                    this.activeLanguage = activeLanguage
                    this.itemService.setLscObservable(this.venueId, this.itemId, activeLanguage);
                    this.itemService.setAvailableLanguagesObservable(this.venueId, this.itemId, activeLanguage);
                })
            } else if (this.venueId && !this.itemId) {
                console.log('find nearest')
                this.itemService.findNearestItem(this.venueId)

            } else {
                console.log('insufficient data')
            }

        })
    }
    languageSelected(language: string) {
        this.activeLanguage = language;
        this.hideSidebar = true;
        this.itemService.setLscObservable(this.venueId, this.itemId, this.activeLanguage);
    }
    onLiked() {
        this.itemService.like(this.venueId, this.itemId)
            .then((res) => {
                this.liked = true;
            })
            .catch(err => console.log(err));
    }
    showAbout() {
        this.hideAbout = false;
    }
    onHideAbout() {
        this.hideAbout = true;
    }
}
