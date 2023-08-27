// https://medium.com/beingcoders/best-way-to-add-country-flags-icon-in-angular-6b593a25d0f3

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './admin/auth/auth.service';
import { User as FirebaseUser } from 'firebase/auth';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setPersistence,
    browserSessionPersistence,
    user,

    getAuth,
    onAuthStateChanged
} from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import * as fromAdmin from './admin/store/admin.reducer'
import * as Admin from './admin/store/admin.actions'
import { AdminState } from './admin/store/admin.reducer';
import { RestoreState } from './admin/store/admin.actions';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private afAuth: Auth,
        private authService: AuthService,
        private router: Router,
        private store: Store<fromAdmin.State>) { }

    ngOnInit(): void {
        // this.store.dispatch(fromAdmin)
        if (localStorage.getItem('adminState')) {
            const adminStateFromLS: AdminState = JSON.parse(localStorage.getItem('adminState'))
            // console.log(adminStateFromLS);
            // console.log(adminStateFromLS.createdAt);
            // console.log(new Date().getTime() - adminStateFromLS.createdAt);
            if (new Date().getTime() - adminStateFromLS.createdAt < 15 * 60 * 1000) {
                fromAdmin.getStateFromLS(adminStateFromLS)
            } else {
                alert('ls expired')
                this.authService.logOut()
            }
            // this.store.dispatch(new Admin.SetStateFromLs(adminState))
        }
        this.afAuth.onAuthStateChanged((user: FirebaseUser) => {
            if (user) {
                // console.log(user)
                this.authService.setUserAfterRefresh(user);
                if (user.uid == 'P91mUtOGYsMxBdjT2dqAAMzaBeG2') {
                    this.authService.setIsAdmin()
                }

            }
            else {
                console.log('no user')
            }
        })
    }

    title = 'mochuco-2.0';
}
