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
    },{
        validator: this.passwordMatchValidator
    });
    userClassTitle;

    constructor(private auth: AuthenticationService, private fb: FormBuilder, private snackbar: MatSnackBar, private classService: ClassesService) {}
    
    ngOnInit() {
        // Show badge with most progress.

        // Milestone that gets shown when you have all badges.
        this.milestoneShown = {
            name: "Gefeliciteerd",
            description: "Je hebt alle badges gehaald",
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
        let oldPassword = this.changePasswordForm.get('oldPassword').value;
        let newPassword = this.changePasswordForm.get('newPassword').value;
        let email = this.userDetails.email;
        this.auth.updatePassword(email, oldPassword, newPassword).subscribe(() => {
            this.snackbar.open("Wachtwoord is aangepast!", "X", {duration: 2500})
        }, (err) => {
            console.error(err);
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
