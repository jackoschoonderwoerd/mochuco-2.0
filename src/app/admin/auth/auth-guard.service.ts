import { Injectable } from '@angular/core';
import { CanActivateFn, UrlTree, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { SnackbarService } from '../shared/snackbar.service';
import { Auth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {

    constructor(
        private authService: AuthService,
        private afAuth: Auth,
        private router: Router) { }

    public canActivate(): boolean {
        // console.log(this.authService.isLoggedIn)
        if (this.afAuth.currentUser) {
            return true
        } else {
            // this.snackbarService.showSnackBar('You need to be logged in.', null, 5000)
            // this.router.navigate(['/admin/log-in'])
            return false
        }
    }
}

