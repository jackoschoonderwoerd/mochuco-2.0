import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Auth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import * as fromApp from './../../../app.reducer'
import { Observable } from 'rxjs';


@Component({
    selector: 'app-top',
    templateUrl: './top.component.html',
    styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

    authUid$: Observable<string>

    constructor(
        private router: Router,
        public authService: AuthService,
        public afAuth: Auth,
        private store: Store<fromApp.State>
    ) { }

    ngOnInit(): void {
        // this.store.subscribe(storeData => console.log(storeData))
        this.authUid$ = this.store.select(fromApp.getAuthUid);
    }

    onVenues() {
        this.router.navigate(['/admin/venues'])
    }
    onLogOut() {
        this.authService.logOut()
    }
    onHome() {
        this.router.navigate(['admin'])
    }
}
