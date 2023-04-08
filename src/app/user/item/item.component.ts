import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from './item.service';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, AfterViewInit {


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
        private router: Router
    ) { }
    ngOnInit(): void {
        console.log('HIDE ABOUT:', this.hideAbout)
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

                this.itemService.setVenueObservable(this.venueId);

                this.itemService.findNearestItem(this.venueId)

            } else {
                console.log('insufficient data')
            }

        })
    }

    ngAfterViewInit(): void {
        // console.log(this.itemContainer.nativeElement.offsetWidth);
        // this.itemContainerWidth = this.itemContainer.nativeElement.offsetWidth;

    }

    getShowAbout() {
        return {
            'left': '100px',

        }
    }

    onLiked() {
        this.itemService.like(this.venueId, this.itemId)
            .then((res) => {
                this.liked = true;
            })
            .catch(err => console.log(err));
    }
    showAbout() {
        console.log('showAbout')
        this.hideAbout = false;
        // this.getPositionAboutLeft();
        console.log('HIDE ABOUT:', this.hideAbout)
    }
    onHideAbout() {
        this.hideAbout = true;
        console.log('HIDE ABOUT:', this.hideAbout)
    }
    onHideSidebar() {
        this.hideSidebar = true;
        console.log('onHideSidebar(){}', this.hideSidebar)
    }
    onShowSidebar() {
        console.log('onShowSidebar(){}', this.hideSidebar);
        this.hideSidebar = false;
    }
    onLogInPage() {
        this.router.navigate(['user/log-in'])
    }
}
