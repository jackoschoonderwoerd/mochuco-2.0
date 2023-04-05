import { Component, Output, EventEmitter } from '@angular/core';
import { ItemService } from '../item.service';

import { Observable } from 'rxjs';
import { FlagService } from '../../shared/flag.service';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    availableLanguages$: Observable<string[]>;

    @Output() closeSidebar = new EventEmitter<string>

    constructor(
        public itemService: ItemService,
        private flagService: FlagService

    ) { }


    onLanguageSelected(language) {
        console.log(language);
        this.itemService.setActiveLanguage(language);
        this.closeSidebar.emit(language);
    }

    getFlagIcon(language) {
        return this.flagService.convertLanguageToCountryCode(language)
    }
}
