import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MochucoUser } from './user.model';
import { AuthService } from 'src/app/admin/auth/auth.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {
    form: FormGroup

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router) { }

    ngOnInit(): void {
        this.initForm()
    }
    initForm() {
        this.form = this.fb.group({
            email: new FormControl('jackoboes@gmail.com', [Validators.required]),
            password: new FormControl('123456', [Validators.required])
        })
    }
    onSubmit() {
        const mochucoUser: MochucoUser = this.form.value
        this.authService.logIn(mochucoUser)
    }
    onCancel() {
        this.router.navigate(['user'])
    }
}
