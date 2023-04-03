import { Component, Output, EventEmitter } from '@angular/core';
import { ItemService } from '../item.service';

import { Observable } from 'rxjs';


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

    ) { }


    onLanguageSelected(language) {
        console.log(language);
        this.itemService.setActiveLanguage(language);
        this.closeSidebar.emit(language);

    }
}
