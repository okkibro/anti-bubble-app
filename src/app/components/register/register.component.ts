import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import {ErrorStateMatcher} from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'mean-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

//TODO: Make sure fields go red when you try to submit and no value is filled in
//TODO: Add check for matching passwords

export class RegisterComponent implements OnInit {
    firstNameFormControl = new FormControl('', [
        Validators.required
    ]);

    lastNameFormControl = new FormControl('', [
        Validators.required
    ]);

    emailFormControl = new FormControl('', [
        Validators.email,
        Validators.required
    ]);

    passwordFormControl = new FormControl('', [
        Validators.required
    ]);

    repeatPasswordFormControl = new FormControl('', [
        Validators.required
    ]);

    matcher = new MyErrorStateMatcher();

    firstName: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string;

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() { }

    registerUser() {
        let user = new User();
        user.email = this.email;
        user.password = this.password;
        user.firstName = this.firstName;
        user.lastName = this.lastName;
        this.authService.register(user).subscribe((res) => {
            this.router.navigate(['login']);
        })
    }
}
