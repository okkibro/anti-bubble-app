import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
    selector: 'mean-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css',
        '../../shared/general-styles.css']
})

export class RegisterComponent implements OnInit {
    registerForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email], this.auth.uniqueEmailValidator()],
        role: ['', Validators.required],
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required],
        classCode: ['',],
    },
    {
        validator: this.passwordMatchValidator
    });

    constructor(private auth: AuthenticationService, private router: Router, private fb: FormBuilder) { }

    ngOnInit() { }

    // TODO: Add check if register is complete before redirecting
    // Method to register a new user based on the information filled in on the form. 
    registerUser() { 
        let user = new User();
        user.firstName = this.registerForm.get('firstName').value;
        user.lastName = this.registerForm.get('lastName').value;
        user.email = this.registerForm.get('email').value;
        user.role = this.registerForm.get('role').value;
        user.password = this.registerForm.get('password').value;
        user.classCode = this.registerForm.get('classCode').value;

        this.auth.register(user).subscribe(() => {
            this.router.navigate(['login']);
        });
    }

    /** Method to check if the filled in passwords match. */
    passwordMatchValidator(form: FormGroup) {
        let password = form.get('password').value;
        let repeatPassword = form.get('repeatPassword').value;
        if (password != repeatPassword) {
            form.get('repeatPassword').setErrors({ noPasswordMatch: true });
        }
    }
}
