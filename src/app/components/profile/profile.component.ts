/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, Inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user';
import { milestones } from '../../../../constants';
import { Milestone } from 'src/app/models/milestone';
import { ClassesService } from 'src/app/services/classes.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

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
        private snackBar: MatSnackBar,
        private classService: ClassesService,
        private router: Router,
        private dialog: MatDialog
    ) { }
    
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
                this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes']}).afterDismissed().subscribe(()=>{
                    window.location.reload();
                });
            } else {
                this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-error'] }).afterDismissed().subscribe(()=>{
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

    /** Method that opens the delete user acocunt dialog. */
    openDeleteAccountDialog() {
        this.dialog.open(DeleteAccountDialog, { data: { role: this.userDetails?.role }});
    }
}

@Component({
    selector: 'delete-account-dialog',
    templateUrl: 'delete-account-dialog.html',
})

export class DeleteAccountDialog {

    constructor(
        private auth: AuthenticationService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<DeleteAccountDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    /** Method to delete a user's account. */
    deleteAccount() {
        this.auth.deleteAccount().subscribe(data => {
            if (data.succes) {
                this.dialogRef.close();
                this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes']}).afterDismissed().subscribe(() => {
                    this.auth.logout();
                });
            }
        })
    }
}