import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'mean-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

// TODO: Make sure you can't see attempted password in plain text in "Network" tab in Chrome

export class LoginComponent implements OnInit {
    submitted = false;
    loginForm: FormGroup;
    authError = false;
    authErrorMsg: string;

    constructor(private authenticationService: AuthenticationService, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar) { 
        this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required] 
        });
    }

    ngOnInit() { }

    loginUser(loginData) {
        let user = new User();
        user.email = loginData.email;
        user.password = loginData.password;
        this.authenticationService.login(user).subscribe(() => {
            this.router.navigate(['home']);
        }, () => {
            this.authError = true;
            this.authErrorMsg = 'Onjuist wachtwoord of email';
            this.snackBar.open("Onjuist wachtwoord of email", 'X', {duration: 2500});
        });
    }
}