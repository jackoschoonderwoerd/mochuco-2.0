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

    constructor(
        private route: ActivatedRoute,
        public itemService: ItemService
    ) { }
    ngOnInit(): void {
        this.route.queryParams.subscribe((params: any) => {
            this.venueId = params.venueId;
            this.itemId = params.itemId;
            this.itemService.setVenueObservable(this.venueId);
            this.itemService.setItemObservable(this.venueId, this.itemId);
            this.itemService.activeLanguage$.subscribe((activeLanguage: string) => {
                this.activeLanguage = activeLanguage
                this.itemService.setLscObservable(this.venueId, this.itemId, activeLanguage);
                this.itemService.setAvailableLanguagesObservable(this.venueId, this.itemId, activeLanguage);
            })

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
        // console.log(this.venueId, this.itemId)
        // this.itemService.updateTimesVisited(this.venueId, this.itemId, this.activeLanguage)
    }
}
