import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
    selector: 'mean-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

// TODO: Add error when trying to login with wrong username password combination

export class LoginComponent implements OnInit {
    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
    });

    constructor(private authenticationService: AuthenticationService, private router: Router, private fb: FormBuilder) { }

    ngOnInit() { }

    loginUser() {
        let user = new User();
        user.email = this.loginForm.get('email').value;
        user.password = this.loginForm.get('password').value;
        this.authenticationService.login(user).subscribe(() => {
            this.router.navigate(['home']);
        }, (err) => {
            console.error(err);
        });
    }
}