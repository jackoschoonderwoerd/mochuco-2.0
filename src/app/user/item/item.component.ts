import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from './item.service';
import { ViewportScroller } from '@angular/common';
import { Venue, Item } from 'src/app/shared/item.model';
import { VenuesService } from 'src/app/admin/services/venues.service';

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
    @ViewChild('itemContainer') private itemContainer: ElementRef
    itemContainerWidth: number;



    constructor(
        private route: ActivatedRoute,
        public itemService: ItemService,
        private router: Router,
        private scroller: ViewportScroller,

    ) { }
    ngOnInit(): void {

        // this.route.queryParams.subscribe((params: any) => {
        //     this.venueId = params.venueId;
        //     this.itemId = params.itemId;
        //     if (this.venueId && this.itemId) {
        //         console.log('venueId and itemId present', this.venueId, this.itemId);
        //         this.itemService.setVenueObservable(this.venueId);
        //         this.itemService.setItemObservable(this.itemId, this.venueId);
        //         this.itemService.activeLanguage$.subscribe((activeLanguage: string) => {
        //             console.log('called from ngOnInit item.component.ts')
        //             this.activeLanguage = activeLanguage
        //             this.itemService.setLscObservable(params.venueId, params.itemId);
        //         })
        //     } else if (this.venueId && !this.itemId) {
        //         console.log('find nearest')

        //         this.itemService.setVenueObservable(this.venueId);

        //         this.itemService.findNearestItem(this.venueId)

        //     } else {
        //         console.log('insufficient data')
        //     }

        // })
    }


    getShowAbout() {
        return {
            'left': '100px',

        }
    }

    onLiked() {
        this.itemService.like()
            .then((res) => {
                this.liked = true;
                // console.log(res)
            })
            .catch(err => console.log(err));
    }

    showAbout() {
        this.hideAbout = false;
    }
    onHideAbout() {
        this.hideAbout = true;
    }
    onHideSidebar() {
        this.hideSidebar = true;
        // console.log('onHideSidebar(){}', this.hideSidebar)
    }
    onShowSidebar() {
        // console.log('onShowSidebar(){}', this.hideSidebar);
        this.hideSidebar = false;
    }
    onLogInPage() {
        this.router.navigate(['user/log-in'])
    }
    onAdjacent(adjacentItemId: string) {

        this.scroller.scrollToPosition([0, 0])
        const sub = this.itemService.venue$.subscribe((venue: Venue) => {
            this.itemService.setObservables(venue.id, adjacentItemId);
        })
        // console.log(adjacentItemId)
        this.liked = false
        // console.log(adjacentItemId)
        this.itemId = adjacentItemId
        // this.itemService.setItemObservable(this.venueId, adjacentItemId);
        // this.scroller.scrollToAnchor('top')
        // this.itemService.activeLanguage$.subscribe((language: string) => {
        //     this.itemService.setLscObservable(this.venueId, adjacentItemId)
        // })
        sub.unsubscribe();
    }
}
