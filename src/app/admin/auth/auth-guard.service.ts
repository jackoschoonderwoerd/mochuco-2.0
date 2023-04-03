import { Injectable } from '@angular/core';
import { CanActivateFn, UrlTree, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { SnackbarService } from '../shared/snackbar.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {

    constructor(
        private authService: AuthService,
        // private snackbarService: SnackbarService,
        // private toastr: ToastrService,
        private router: Router) { }

    public canActivate(): boolean {
        console.log(this.authService.isLoggedIn)
        if (this.authService.isLoggedIn) {
            return true
        } else {
            // this.snackbarService.showSnackBar('You need to be logged in.', null, 5000)
            this.router.navigate(['/admin/log-in'])
            return false
        }
        // return this.authService.isLoggedIn;
        // this.authService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
        //     if (isLoggedIn) {
        //         return true;
        //     } else {
        //         console.log('not logged in')
        //         return false;
        //     }
        // })

    }
}

