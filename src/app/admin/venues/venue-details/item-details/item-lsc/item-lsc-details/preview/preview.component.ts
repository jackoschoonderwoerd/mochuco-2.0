import { Component, Input, OnInit } from '@angular/core';
import { ItemDetailsDbService } from '../../../item-details-db.service';
import { LSContent, Item } from '../../../../../../../shared/item.model';

@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
    @Input('lsc') public lsc: LSContent;
    @Input('item') public item: Item;
    // @Input('venueId') public venueId: string;
    // @Input('language') public language: string;
    // lsc: LSContent
    // item: Item

    constructor(
        private itemDetailsDbService: ItemDetailsDbService
    ) { }

    ngOnInit(): void {
        // this.itemDetailsDbService.getLSCbyLanguage(this.venueId, this.itemId, this.language)
        // .subscribe((lsc: LSContent)=> {
        //     this.lsc = lsc
        // })
        // this.itemDetailsDbService.readItem(this.venueId, this.itemId)
        // .subscribe((item: Item) => {
        //     this.item = item
        // })

    }
}
