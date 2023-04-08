import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ItemService } from '../item/item.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WarningComponent } from 'src/app/admin/shared/warning/warning.component';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

    @Output() hideAbout: EventEmitter<void> = new EventEmitter();
    public activeLanguage: string;

    constructor(
        public itemService: ItemService,
        private router: Router,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        console.log(screen.width)
        console.log(window.innerWidth)
        this.itemService.activeLanguage$.subscribe((activeLanguage: string) => {
            this.activeLanguage = activeLanguage
        })
    }

    onHideAbout() {
        console.log('onHideAbout(){}')
        this.hideAbout.emit();
    }
    onLogin() {
        console.log(screen.width)
        console.log(window.innerWidth)
        if (window.innerWidth < 1400) {
            this.dialog.open(WarningComponent, {
                data: {
                    message: 'Your screen needs to be at least 1400px wide to enter the admin section'
                }
            })
        } else {
            this.router.navigate(['user/log-in'])
        }
    }
}
