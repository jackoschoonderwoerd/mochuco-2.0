import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './admin/auth/auth.service';
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

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private afAuth: Auth,
        private authService: AuthService,
        private router: Router) { }

    ngOnInit(): void {
        this.afAuth.onAuthStateChanged((user) => {
            if (user) {
                this.authService.setUserAfterRefresh(user);
                console.log(user)
                if (user.uid == 'P91mUtOGYsMxBdjT2dqAAMzaBeG2') {
                    this.authService.setIsAdmin()
                }
                // this.router.navigate(['admin/venues'])
                // this.router.navigate(['admin/item-lsc-description', { venueId: 'F4TmvZS3LTLLSGocx5tQ', itemId: 'VhUBJ3ydSt2wNcgutwgZ', language: 'german' }])
                // this.router.navigate(['/admin/item-details', { venueId: 'F4TmvZS3LTLLSGocx5tQ', itemId: '50k1gGERTzBYO3N46o5X' }]);
                // IS MAIN ITEM
                // this.router.navigate(['/admin/main-page', { venueId: 'F4TmvZS3LTLLSGocx5tQ', itemId: '50k1gGERTzBYO3N46o5X' }]);
                // this.router.navigate(['admin/coordinates', { itemName: 'VhUBJ3ydSt2wNcgutwgZ', venueName: 'F4TmvZS3LTLLSGocx5tQ' }])
                // this.router.navigate(['/admin/item-details', { venueId: 'E2KYXZLyFHPKVCkSANGx', itemId: 'kWQOQ9DcwIfP7uIOpnQC' }])
                // this.router.navigate(['admin/venue-details', { venueId: 'E2KYXZLyFHPKVCkSANGx' }])
            }
            else {
                this.router.navigate(['admin/log-in'])
            }
        })
    }

    title = 'mochuco-2.0';
}
