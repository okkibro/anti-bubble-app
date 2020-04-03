import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { User } from '../../models/user';

@Component({
    selector: 'mean-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
    userDetails: User;
    changePasswordForm = this.fb.group({
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        repeatPassword: ['', Validators.required]
    },{
        validator: this.passwordMatchValidator
    });


    constructor(private auth: AuthenticationService, private fb: FormBuilder) {}
    
    ngOnInit() {
        this.auth.profile().subscribe(user => {
            this.userDetails = user;
        }, (err) => {
            console.error(err);
        });
    }

    changePassword() {
        let oldPassword = this.changePasswordForm.get('oldPassword').value;
        let newPassword = this.changePasswordForm.get('newPassword').value;
        let email = this.userDetails.email;
        this.auth.updatePassword(email, oldPassword, newPassword).subscribe(() => {
            alert("password is changed")
        }, (err) => {
            console.error(err);
        });
    }

    logoutButton() {
      return this.auth.logout();
    }

    passwordMatchValidator(form: FormGroup) {
        let newpassword = form.get('newPassword').value;
        let repeatPassword = form.get('repeatPassword').value;
        if (newpassword != repeatPassword) {
            form.get('repeatPassword').setErrors({ noPasswordMatch: true });
        }
    }

}
