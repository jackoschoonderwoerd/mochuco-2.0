import { Injectable } from '@angular/core';
import { MochucoUser } from './log-in/user.model';
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
import { from, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from './../../app.reducer'
import * as AuthActions from './auth.actions'
import { User as FirebaseUser } from "firebase/auth";
import { VenuesService } from '../services/venues.service';
import * as fromAdmin from './../store/admin.reducer';
import * as Admin from './../store/admin.actions'
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private isAdminSubject = new BehaviorSubject<boolean>(false);
    public isAdmin$ = this.isAdminSubject.asObservable();

    // private isLoggedInSubject = new BehaviorSubject<boolean>(null);
    // public isLoggedIn$ = this.isLoggedInSubject.asObservable();

    public isLoggedIn: boolean = false;

    constructor(
        private afAuth: Auth,
        private router: Router,
        private store: Store<fromApp.State>,
        private venuesService: VenuesService
    ) { }

    setUserAfterRefresh(user: FirebaseUser) {
        // console.log(user.uid)
        // this.isLoggedInSubject.next(true);
        // this.isLoggedIn = true;
        this.store.dispatch(new AuthActions.SetAuthUid(user.uid))
        if (user.uid === 'P91mUtOGYsMxBdjT2dqAAMzaBeG2') {
            this.store.dispatch(new AuthActions.SetIsAdmin(true));
            this.venuesService.readVenues(user.uid)
        } else {
            this.store.dispatch(new AuthActions.SetIsAdmin(false));
            this.venuesService.readVenues(user.uid)
        }
    }

    setIsAdmin() {
        this.isAdminSubject.next(true)

        this.router.navigateByUrl('/admin/venues')
    }

    logIn(mochucoUser: MochucoUser) {

        signInWithEmailAndPassword(this.afAuth, mochucoUser.email, mochucoUser.password)
            .then((res: any) => {
                // console.log(res.user.uid);
                const firebaseUser: FirebaseUser = res.user
                if (res.user.uid == 'P91mUtOGYsMxBdjT2dqAAMzaBeG2') {
                    // console.log('admin')
                    this.isAdminSubject.next(true)
                    this.store.dispatch(new AuthActions.SetIsAdmin(true))
                } else {

                    this.store.dispatch(new AuthActions.SetAuthUid(res.user.uid));
                    // this.isLoggedIn = true
                    // this.isLoggedInSubject.next(true)
                }
                this.router.navigate(['admin'])
            })
            .catch(err => console.log(err));
    }


    logOut() {
        this.afAuth.signOut()
            .then((res) => {
                localStorage.removeItem('adminState');
                this.isLoggedIn = false;
                console.log('logging out')
                this.store.dispatch(new AuthActions.SetUnauthenticated());
                this.store.dispatch(new AuthActions.SetIsAdmin(false));
                this.router.navigate([''])
                this.isAdminSubject.next(false);
                this.store.dispatch(new Admin.SetEmptyState())

            })
            .catch(err => console.log(err));
    }
}
