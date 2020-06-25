/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordRecoveryService } from '../../services/password-recovery.service';

@Component({
    selector: 'mean-password-reset',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.css',
        '../../shared/general-styles.css']
})
export class PasswordResetComponent implements OnInit {
    passwordResetForm = this.fb.group({
        password: ['', [Validators.required]],
        repeatPassword: ['', Validators.required],
    },
    {
        validator: this.passwordMatchValidator
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private passwordRecoveryService: PasswordRecoveryService
    ) { }

    ngOnInit(): void {

        // Check if token is correct, otherwise navigate back to login.
        this.passwordRecoveryService.getResetPage(this.route.snapshot.paramMap.get('token')).subscribe((data) => {
            if (data.correct) {
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

    //TODO: VALIDATE PASSWORDS IN FRONTEND.
    /** Method to reset your password based on th filled in passwords in the form. */
    resetPassword() {

        // Get password and confirm from the form.
        let password = this.passwordResetForm.get('password').value;
        let repeatPassword = this.passwordResetForm.get('repeatPassword').value;

        // Send password and confirm to back-end which will return whether it was a succes and the message to show the user.
        this.passwordRecoveryService.postNewPassword(this.route.snapshot.paramMap.get('token'), password, repeatPassword).subscribe(data => {
            if (!data.succes) {
                this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-error'], });
            } else {
                this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes'], }).afterDismissed().subscribe(() => {
                    this.router.navigate(['/login']);
                });
            }
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

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
