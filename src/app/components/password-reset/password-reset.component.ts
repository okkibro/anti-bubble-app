/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * @packageDocumentation
 * @module Components
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { titleTrail } from '../../../../constants';
import { PasswordRecoveryService } from '../../services/password-recovery.service';

/**
 * This class handles all the logic for handling resetting the user's old password by setting a new one through
 * a form. This page can only be visited by a user who is already registered in the database, requested a new
 * password through the password-recovery component and clicked the link with the correct reset token.
 */
@Component({
	selector: 'password-reset-component',
	templateUrl: './password-reset.component.html',
	styleUrls: ['./password-reset.component.css',
		'../../shared/general-styles.css']
})

export class PasswordResetComponent implements OnInit {
	public passwordResetForm = this.fb.group({
			password: ['', [Validators.required]],
			repeatPassword: ['', Validators.required]
		},
		{
			validator: PasswordResetComponent.passwordMatchValidator
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
	 * @return
	 */
	public ngOnInit(): void {

		// Check if token is correct, otherwise navigate back to login.
		this.passwordRecoveryService.getResetPage(this.route.snapshot.paramMap.get('token')).subscribe(data => {
			if (!data.correct) {
				this.router.navigate(['/login']);
			}
		});

		// Set page title.
		this.titleService.setTitle('Wachtwoord resetten' + titleTrail);
	}

	/**
	 * Method to reset your password based on the filled in passwords in the form.
	 * @return
	 */
	public resetPassword(): void {

		// Get password from the form.
		let newPassword = this.passwordResetForm.get('password').value;

		// Send password and confirm to back-end which will return whether it was a succes and the message to show the user.
		this.passwordRecoveryService.postNewPassword(this.route.snapshot.paramMap.get('token'), newPassword).subscribe(data => {
			if (!data.succes) {
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-error'] });
			} else {
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes'] }).afterDismissed().subscribe(() => {
					this.router.navigate(['/login']);
				});
			}
		});
	}

	/**
	 * Method to check if the filled in passwords match.
	 * @param form Form in which the validation has to take place.
	 * @return
	 */
	private static passwordMatchValidator(form: FormGroup): void {
		let password = form.get('password').value;
		let repeatPassword = form.get('repeatPassword').value;
		if (password != repeatPassword) {
			form.get('repeatPassword').setErrors({ noPasswordMatch: true });
		}
	}
}
