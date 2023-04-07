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

    @Output() closeSidebar = new EventEmitter<void>

    constructor(
        public itemService: ItemService,
        private flagService: FlagService

    ) { }


    languageSelected(language) {
        console.log(language);
        this.itemService.setActiveLanguage(language);
        this.onClose()
    }

    getFlagIcon(language) {
        return this.flagService.convertLanguageToCountryCode(language)
    }
    onClose() {
        console.log('onClose(){}')
        this.closeSidebar.emit(null);
    }
}
