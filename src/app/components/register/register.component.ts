import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import {User} from '../../models/user';

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
        email: ['', [Validators.required, Validators.email], this.authenticationService.uniqueEmailValidator()],
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required],
    },
        {
            validator: this.passwordMatchValidator
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
        });
    }

    passwordMatchValidator(form: FormGroup) {
        let password = form.get('password').value;
        let repeatPassword = form.get('repeatPassword').value;
        if (password != repeatPassword) {
            form.get('repeatPassword').setErrors({ noPasswordMatch: true });
        }
    }

    // uniqueEmailValidator(control: FormControl) {
    //     return new Promise((resolve) => {
    //         setTimeout(() => {
    //             this.authenticationService.checkEmailTaken(control.value).subscribe((res) => {
    //                 console.log(res);
    //                 resolve(null);
    //             }, () => {
    //                 resolve({'emailTaken': true});
    //             });
    //         }, 250);
    //     });
    // }
}
