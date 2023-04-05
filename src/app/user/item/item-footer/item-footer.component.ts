import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ItemService } from '../item.service';
import { FlagService } from '../../shared/flag.service';

@Component({
    selector: 'app-item-footer',
    templateUrl: './item-footer.component.html',
    styleUrls: ['./item-footer.component.scss']
})
export class ItemFooterComponent implements OnInit {

    @Output() showSidebar = new EventEmitter<void>



    constructor(
        private router: Router,
        public itemService: ItemService,
        private flagService: FlagService
    ) { }

    ngOnInit(): void {
        this.itemService.activeLanguage$.subscribe((language: string) => {

        })
    }


    getFlag(language) {
        return this.flagService.convertLanguageToCountryCode(language)
    }

    onScanner() {
        this.router.navigate(['/user/scanner'])
    }
    onSelectLanguage() {
        this.showSidebar.emit()
    }
}
