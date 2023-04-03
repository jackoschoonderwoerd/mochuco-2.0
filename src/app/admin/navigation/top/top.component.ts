import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Auth } from '@angular/fire/auth';

@Component({
    selector: 'app-top',
    templateUrl: './top.component.html',
    styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public authService: AuthService,
        public afAuth: Auth
    ) { }

    ngOnInit(): void {
        // console.log(this.afAuth.currentUser.email)
    }

    onVenues() {
        this.router.navigate(['/admin/venues'])
    }
    onLogOut() {
        this.authService.logOut()
    }
}
