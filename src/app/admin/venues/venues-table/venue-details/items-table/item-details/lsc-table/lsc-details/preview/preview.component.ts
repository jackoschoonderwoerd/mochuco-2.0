import { Component, Input, OnInit } from '@angular/core';
// import { ItemDetailsDbService } from '../../../../../../services/item-details-db.service';
// import { LSContent, Item } from '../../../../../../../shared/item.model';
import { Store } from '@ngrx/store';
import * as fromAdmin from 'src/app/admin/store/admin.reducer';
import * as Admin from 'src/app/admin/store/admin.actions';
import { Observable } from 'rxjs';
import { Item, LSContent } from 'src/app/shared/item.model';
import { ItemDetailsDbService } from 'src/app/admin/services/item-details-db.service';
@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

    lsc$: Observable<LSContent>
    item$: Observable<Item>

    constructor(
        private itemDetailsDbService: ItemDetailsDbService,
        private store: Store
    ) { }

    ngOnInit(): void {
        this.lsc$ = this.store.select(fromAdmin.getLanguage)
        this.item$ = this.store.select(fromAdmin.getItem)
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
