/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user';
import { milestones } from '../../../../constants';
import { Milestone } from 'src/app/models/milestone';
import { ClassesService } from 'src/app/services/classes.service';

@Component({
    selector: 'mean-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css',
        '../../shared/general-styles.css']
})

export class ProfileComponent implements OnInit {
    userDetails: User;
    milestoneShown: Milestone;
    changePasswordForm = this.fb.group({
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        repeatPassword: ['', Validators.required]
    }, {
        validator: this.passwordMatchValidator
    });
    userClassTitle: string;

    constructor(
        private auth: AuthenticationService,
        private fb: FormBuilder,
        private snackbar: MatSnackBar,
        private classService: ClassesService
    ) {}
    
    ngOnInit() {

        // Milestone that gets shown when you have all badges.
        this.milestoneShown = {
            name: 'Gefeliciteerd',
            description: 'Je hebt alle badges gehaald',
            index: 0,
            maxValue: 0
        }

        // Get user's class
        this.classService.getClass().subscribe((data) => {
            if (data.succes) {
                this.userClassTitle = data.class.title;
            }
        });
        
        this.auth.profile().subscribe(user => {
            this.userDetails = user;
            // Loop over all milestones and find the one with the most progress that the user didnt complete yet.
            for (let i = 0; i < milestones.length; i++) {
                if (user.milestones[i] != milestones[i].maxValue && user.milestones[i] >= user.milestones[this.milestoneShown.index]) {
                    this.milestoneShown = milestones[i];
                }
            }
        }, (err) => {
            console.error(err);
        });
    }

    /** Method to change you password on the profile page. */
    changePassword() {
        let email = this.userDetails.email;
        let oldPassword = this.changePasswordForm.get('oldPassword').value;
        let newPassword = this.changePasswordForm.get('newPassword').value;
        this.auth.updatePassword(email, oldPassword, newPassword).subscribe(data => {
            if (data.succes) {
                this.snackbar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes']}).afterDismissed().subscribe(()=>{
                    window.location.reload();
                });
            } else {
                this.snackbar.open(data.message, 'X', { duration: 2500, panelClass: ['style-error'] }).afterDismissed().subscribe(()=>{
                    window.location.reload();
                });
            }
        });
    }

    /** Method to check of the passwords given in the form match. */
    passwordMatchValidator(form: FormGroup) {
        let newpassword = form.get('newPassword').value;
        let repeatPassword = form.get('repeatPassword').value;
        if (newpassword != repeatPassword) {
            form.get('repeatPassword').setErrors({ noPasswordMatch: true });
        }
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */