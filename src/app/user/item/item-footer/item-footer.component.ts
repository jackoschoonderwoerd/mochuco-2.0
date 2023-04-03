import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-item-footer',
    templateUrl: './item-footer.component.html',
    styleUrls: ['./item-footer.component.scss']
})
export class ItemFooterComponent {

    @Output() showSidebar = new EventEmitter<void>

    constructor(private router: Router) { }

    onScanner() {

        this.router.navigate(['/user/scanner'])
    }
    onSelectLanguage() {
        this.showSidebar.emit()
    }
}
