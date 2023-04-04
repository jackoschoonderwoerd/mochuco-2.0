import { Component, Output, EventEmitter } from '@angular/core';
import { ItemService } from '../item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/shared/item.model';

@Component({
    selector: 'app-item-header',
    templateUrl: './item-header.component.html',
    styleUrls: ['./item-header.component.scss']
})
export class ItemHeaderComponent {

    mainItemActive: boolean = false;
    venueId: string;
    itemId: string;

    constructor(
        public itemService: ItemService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    @Output() showAbout: EventEmitter<void> = new EventEmitter()

    onMochucoLogo() {
        this.showAbout.emit();
    }

    onVenueLogo() {
        this.itemId = this.route.snapshot.queryParams['itemId']
        this.venueId = this.route.snapshot.queryParams['venueId'];
        this.itemService.activeLanguage$.subscribe((activeLanguage: string) => {
            if (!this.mainItemActive) {
                this.itemService.getMainItem(this.venueId).subscribe((mainItems: Item[]) => {
                    const mainItemId = mainItems[0].id;
                    this.itemService.setItemObservable(this.venueId, mainItemId);
                    this.itemService.setLscObservable(this.venueId, mainItemId, activeLanguage)
                })
                this.mainItemActive = true;
            } else {
                this.itemService.setItemObservable(this.venueId, this.itemId)
                this.itemService.setLscObservable(this.venueId, this.itemId, activeLanguage)
                this.mainItemActive = false;
            }
        })
    }
}

