import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
    selector: 'mean-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

// TODO: Add extra field to verify password is typed in correctly
// TODO: Check whether SQL-injection or input scrubbing has to be done here

export class RegisterComponent implements OnInit {
    registerForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
    });

    constructor(private authenticationService: AuthenticationService, private router: Router, private fb: FormBuilder) { }

    ngOnInit() { }

    registerUser() {
        let user = new User();
        user.firstName = this.registerForm.get('firstName').value;
        user.lastName = this.registerForm.get('lastName').value;
        user.email = this.registerForm.get('email').value;
        user.password = this.registerForm.get('password').value;

        this.authenticationService.register(user).subscribe(() => {
            this.router.navigate(['login']);
        })
    }
}
