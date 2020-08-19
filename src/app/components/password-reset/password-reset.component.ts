/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * password-reset.component.ts
 * This file handles all the logic for handling resetting the user's old password by setting a new one through
 * a form. This page can only be visited by a user who is already registered in the database, requested a new
 * password through the password-recovery component and clicked the link with the correct reset token.
 * @packageDocumentation
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordRecoveryService } from '../../services/password-recovery.service';
import { environment } from '../../../environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'mean-password-reset',
	templateUrl: './password-reset.component.html',
	styleUrls: ['./password-reset.component.css',
		'../../shared/general-styles.css']
})

export class PasswordResetComponent implements OnInit {
	passwordResetForm = this.fb.group({
			password: ['', [Validators.required]],
			repeatPassword: ['', Validators.required]
		},
		{
			validator: this.passwordMatchValidator
		});

	/**
	 * PasswordResetComponent constructor.
	 * @param route
	 * @param router
	 * @param fb
	 * @param snackBar
	 * @param passwordRecoveryService
	 * @param titleService
	 */
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		private passwordRecoveryService: PasswordRecoveryService,
		private titleService: Title
	) { }


	/**
	 * Initialization method.
	 * @returns
	 */
	ngOnInit(): void {

		// Check if token is correct, otherwise navigate back to login.
		this.passwordRecoveryService.getResetPage(this.route.snapshot.paramMap.get('token')).subscribe((data) => {
			if (!data.correct) {
				this.router.navigate(['/login']);
			}
		});

		this.titleService.setTitle('Wachtwoord resetten' + environment.TITLE_TRAIL);
	}

	/**
	 * Method to reset your password based on the filled in passwords in the form.
	 * @returns
	 */
	resetPassword(): void {

		// Get password and confirm from the form.
		let password = this.passwordResetForm.get('password').value;
		let repeatPassword = this.passwordResetForm.get('repeatPassword').value;

		// Send password and confirm to back-end which will return whether it was a succes and the message to show the user.
		this.passwordRecoveryService.postNewPassword(this.route.snapshot.paramMap.get('token'), password, repeatPassword).subscribe(data => {
			if (!data.succes) {
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-error'] });
			} else {
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes'] }).afterDismissed().subscribe(() => {
					this.router.navigate(['/login']);
				});
			}
		});
	}

	/** Method to check if the filled in passwords match.
	 * @param form Form in which the validation has to take place.
	 * @returns
	 */
	passwordMatchValidator(form: FormGroup): void {
		let password = form.get('password').value;
		let repeatPassword = form.get('repeatPassword').value;
		if (password != repeatPassword) {
			form.get('repeatPassword').setErrors({ noPasswordMatch: true });
		}
	}
}
