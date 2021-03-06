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
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { titleTrail } from '../../../../constants';
import { PasswordRecoveryService } from '../../services/password-recovery.service';

/**
 * This class handles all the logic for handling the password recovery form for users who have forgotten
 * their password and want to request a new one.
 */
@Component({
	selector: 'password-recovery-component',
	templateUrl: './password-recovery.component.html',
	styleUrls: ['./password-recovery.component.css',
		'../../shared/general-styles.css']
})

export class PasswordRecoveryComponent implements OnInit {
	public passwordRecoveryForm = this.fb.group({
		email: ['', [Validators.required, Validators.email]]
	});

	/**
	 * PasswordRecoveryComponent constructor.
	 * @param passwordRecoveryService
	 * @param router
	 * @param fb
	 * @param snackBar
	 * @param titleService
	 */
	constructor(
		private passwordRecoveryService: PasswordRecoveryService,
		private router: Router,
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		private titleService: Title
	) { }

	/**
	 * Initialization method.
	 * @return
	 */
	public ngOnInit(): void {
		// Set page title.
		this.titleService.setTitle('Wachtwoord vergeten' + titleTrail);
	}

	/**
	 * Method to send an email to the user to reset their password.
	 * @return
	 */
	public sendEmail(): void {

		// Get email from the input field.
		let email = this.passwordRecoveryForm.get('email').value;

		// Send email, data returns whether the action was a succes and a message to show to the user.
		this.passwordRecoveryService.sendEmail(email).subscribe(data => {
			if (data.succes) {
				this.snackBar.open(data.message, 'X', { duration: 5000, panelClass: ['style-succes'] }).afterDismissed().subscribe(() => {
					this.router.navigate(['/login']);
				});
			} else {
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-error'] });
			}
		});
	}
}
