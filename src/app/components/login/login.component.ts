import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'mean-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css',
                '../../shared/general-styles.css']
})

// TODO: Make sure you can't see attempted password in plain text in "Network" tab in Chrome

export class LoginComponent implements OnInit {
    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
    });

    constructor(private auth: AuthenticationService, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar) { }

    ngOnInit() { }

    /** Method to login. */ 
    loginUser() {
        let user = new User();
        user.email = this.loginForm.get('email').value;
        user.password = this.loginForm.get('password').value;
        this.auth.login(user).subscribe(() => {
            this.router.navigate(['home']);
        }, () => {
            this.snackBar.open("Onjuist wachtwoord of email", 'X', {duration: 2500});
        });
    }
}