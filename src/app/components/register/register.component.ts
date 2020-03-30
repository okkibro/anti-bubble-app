import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import {User} from '../../models/user';
import {uniqueEmailValidator} from '../../services/unique-email-validator.directive';

@Component({
    selector: 'mean-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

// TODO: Add error when trying to register with already used email address

export class RegisterComponent implements OnInit {
    registerForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email], uniqueEmailValidator(this.authenticationService)],
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required],
    },
        {
            validator: [this.passwordMatchValidator, uniqueEmailValidator(this.authenticationService)]
        });

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
        private fb: FormBuilder
    ) { }

    ngOnInit() { }

    registerUser() {
        let user = new User();
        user.firstName = this.registerForm.get('firstName').value;
        user.lastName = this.registerForm.get('lastName').value;
        user.email = this.registerForm.get('email').value;
        user.password = this.registerForm.get('password').value;

        this.authenticationService.register(user).subscribe(() => {
            this.router.navigate(['login']);
        });
    }

    passwordMatchValidator(form: FormGroup) {
        let password = form.get('password').value;
        let repeatPassword = form.get('repeatPassword').value;
        if (password != repeatPassword) {
            form.get('repeatPassword').setErrors({ noPasswordMatch: true });
        }
    }
}
