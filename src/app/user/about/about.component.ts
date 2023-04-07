import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ItemService } from '../item/item.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

    @Output() hideAbout: EventEmitter<void> = new EventEmitter();
    public activeLanguage: string;

    constructor(
        public itemService: ItemService
    ) { }

    ngOnInit(): void {
        this.itemService.activeLanguage$.subscribe((activeLanguage: string) => {
            this.activeLanguage = activeLanguage
        })
    }

    onHideAbout() {
        console.log('onHideAbout(){}')
        this.hideAbout.emit();
    }
}
