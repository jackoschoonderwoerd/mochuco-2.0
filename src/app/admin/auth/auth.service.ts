import { Injectable } from '@angular/core';
import { MochucoUser } from '../../user/log-in/user.model';
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

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private isAdminSubject = new BehaviorSubject<boolean>(false);
    public isAdmin$ = this.isAdminSubject.asObservable();

    private isLoggedInSubject = new BehaviorSubject<boolean>(null);
    public isLoggedIn$ = this.isLoggedInSubject.asObservable();

    public isLoggedIn: boolean = false;

    constructor(
        private afAuth: Auth,
        private router: Router,
    ) { }

    setUserAfterRefresh(user: any) {
        this.isLoggedInSubject.next(true);
        this.isLoggedIn = true;
    }

    setIsAdmin() {
        this.isAdminSubject.next(true)
    }

    logIn(mochucoUser: MochucoUser) {
        // console.log(mochucoUser)
        // return from(signInWithEmailAndPassword(this.afAuth, mochucoUser.email, mochucoUser.password))
        //     .pipe(
        //         tap((fireAuthUser: any) => {
        //             this.isLoggedInSubject.next(true)
        //             console.log(fireAuthUser)
        //             this.router.navigateByUrl('/admin/venues');
        //             if (fireAuthUser.user.email === 'jackoboes@gmail.com') {
        //                 this.isAdminSubject.next(true);
        //             } else {
        //                 this.isAdminSubject.next(false);
        //                 console.log('not admin')
        //             }
        //         })
        //     )
        signInWithEmailAndPassword(this.afAuth, mochucoUser.email, mochucoUser.password)
            .then((res: any) => {
                console.log(res.user.uid);
                if (res.user.uid == 'P91mUtOGYsMxBdjT2dqAAMzaBeG2') {
                    console.log('admin')
                    this.isAdminSubject.next(true)
                }
                this.isLoggedIn = true
                this.isLoggedInSubject.next(true)
                this.router.navigate(['admin'])
            })
            .catch(err => console.log(err));
    }


    logOut() {
        this.afAuth.signOut()
            .then((res) => {
                this.isLoggedIn = false;
                console.log('logged out')
                this.isLoggedInSubject.next(false);
                this.router.navigate([''])
                this.isAdminSubject.next(false);
            })
            .catch(err => console.log(err));
    }
}
