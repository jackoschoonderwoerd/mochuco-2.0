import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ItemService } from '../item.service';

@Component({
    selector: 'app-item-footer',
    templateUrl: './item-footer.component.html',
    styleUrls: ['./item-footer.component.scss']
})
export class ItemFooterComponent {

    @Output() showSidebar = new EventEmitter<void>



    constructor(
        private router: Router,
        public itemService: ItemService
    ) { }




    onScanner() {

        this.router.navigate(['/user/scanner'])
    }
    onSelectLanguage() {
        this.showSidebar.emit()
    }
}
