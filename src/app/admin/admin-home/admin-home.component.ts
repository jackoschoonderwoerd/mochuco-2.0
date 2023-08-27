import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent {
    constructor(
        private router: Router,
        public authService: AuthService,
        public afAuth: Auth) { }

    onLogIn() {
        this.router.navigate(['user/log-in'])
    }
    // onAddPreface() {
    //     this.router.navigate(['/admin/item-lsc-description', { action: 'preface' }])
    // }
}
