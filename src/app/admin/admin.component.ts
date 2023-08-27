import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as fromApp from './../app.reducer'
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {


    isAdmin$: Observable<boolean>

    constructor(
        private store: Store<fromApp.State>
    ) { }

    ngOnInit(): void {
        this.store.subscribe(data => console.log(data))
        this.isAdmin$ = this.store.select(fromApp.getIsAdmin)
    }

}
