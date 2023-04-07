import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/shared/item.model';

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

    constructor(
        public itemService: ItemService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    @Output() showAbout: EventEmitter<void> = new EventEmitter()


    ngOnInit(): void {
        // this.route.params.subscribe((params: any) => {

        // })
    }

    onMochucoLogo() {
        this.showAbout.emit();
        // MOVHUCO VENUE ID: XBgtJKT5gYtn1RoX30sP
        // MOCHUCO ITEM ID: qukstOaxlI6NPjKv6Z0b
    }

    onVenueLogo() {
        // whs: VhUBJ3ydSt2wNcgutwgZ

        // console.log(this.route.queryParams['venueId']);
        // console.log(this.route.snapshot.params)
        // console.log(this.previousItemId, this.venueId)
        if (!this.mainItemActive) {
            this.route.queryParams.forEach((param: any) => {
                console.log(param)
                // const venueId = param['venueId']
                if (param['venueId']) {
                    this.venueId = param['venueId']
                }
                if (param['itemId']) {
                    this.previousItemId = param['itemId']
                }
            });
            console.log(this.venueId);
            console.log(this.previousItemId);
            this.toMainItem()
        }
        else {
            this.toSubItem()
        }
    }

    toMainItem() {
        console.log('toMainItem', this.venueId)
        this.itemService.getMainItem(this.venueId).subscribe((mainItems: Item) => {
            console.log(mainItems)
            const mainItem: Item = mainItems[0]
            this.itemService.setItemObservable(this.venueId, mainItem.id)
            this.itemService.activeLanguage$.subscribe((language: string) => {
                this.itemService.setLscObservable(this.venueId, mainItem.id, language)
            })
            this.mainItemActive = true;
        })
    }

    toSubItem() {
        console.log('toSubItem(){}')
        console.log(this.previousItemId)
        if (this.previousItemId) {
            this.toPreviousItem()
        } else {
            this.toNearest()
        }
    }
    toPreviousItem() {
        console.log('toPreviousItem(){}', this.previousItemId)
        this.itemService.setItemObservable(this.venueId, this.previousItemId)
        this.itemService.activeLanguage$.subscribe((language: string) => {
            this.itemService.setLscObservable(this.venueId, this.previousItemId, language)
        })
        this.mainItemActive = false;
        this.previousItemId = null;
    }
    toNearest() {
        console.log('toNearest(){}')
        this.itemService.findNearestItem(this.venueId)
        this.mainItemActive = false;

    }
}

