/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * settings.component.ts
 * This file handles all the logic for user's who want to change certain field of their profile, like first name
 * or email. Also contains a form for changing a user's password, very similar to the one found in the
 * password-reset component. Finally, contains a sub-component, DeleteAccountDialog, for when a user wants to
 * delete his account from the app.
 * @packageDocumentation
 */

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { titleTrail } from '../../../../constants';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClassesService } from '../../services/classes.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'mean-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css',
		'../../shared/general-styles.css']
})

export class SettingsComponent implements OnInit {
	changePasswordForm = this.fb.group({
		oldPassword: ['', Validators.required],
		newPassword: ['', Validators.required],
		repeatPassword: ['', Validators.required]
	}, {
		validator: this.passwordMatchValidator
	});
	editProfileForm = this.fb.group({
		firstName: [''],
		lastName: [''],
		email: ['', {
			validators: [Validators.email],
			asyncValidators: [this.userService.uniqueEmailValidator()],
			updateOn: 'blur'
		}]
	});
	userDetails: User;
	editEnabledFirstName: boolean = false;
	editEnabledLastName: boolean = false;
	editEnabledEmail: boolean = false;

	/**
	 * SettingsComponent constructor.
	 * @param fb
	 * @param snackBar
	 * @param classesService
	 * @param router
	 * @param dialog
	 * @param titleService
	 * @param userService
	 */
	constructor(
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		private classesService: ClassesService,
		private router: Router,
		private dialog: MatDialog,
		private titleService: Title,
		private userService: UserService
	) { }

	/**
	 * Initialization method.
	 * @return
	 */
	ngOnInit(): void {
		this.userService.profile().subscribe(user => {
			this.userDetails = user;
		});

		// Set page title.
		this.titleService.setTitle('Instellingen' + titleTrail);
	}

	/**
	 * Method to change you password on the profile page.
	 * @return
	 */
	changePassword(): void {
		let oldPassword = this.changePasswordForm.get('oldPassword').value;
		let newPassword = this.changePasswordForm.get('newPassword').value;
		this.userService.updatePassword(oldPassword, newPassword).subscribe(data => {
			if (data.succes) {
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes'] }).afterDismissed().subscribe(() => {
					window.location.reload();
				});
			} else {
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-error'] }).afterDismissed().subscribe(() => {
					window.location.reload();
				});
			}
		});
	}

	/** Method to check if the filled in passwords match.
	 * @param form Form in which the validation has to take place.
	 * @return
	 */
	passwordMatchValidator(form: FormGroup): void {
		let newpassword = form.get('newPassword').value;
		let repeatPassword = form.get('repeatPassword').value;
		if (newpassword != repeatPassword) {
			form.get('repeatPassword').setErrors({ noPasswordMatch: true });
		}
	}

	/**
	 * Method that opens the delete user acocunt dialog.
	 * @return
	 */
	openDeleteAccountDialog(): void {
		this.dialog.open(DeleteAccountDialog, { data: { role: this.userDetails?.role }});
	}

	/** Method that changes the profile-table so that it can be edited
	 * @param field Row of user's profile that has to switch to/from edit mode.
	 * @return
	 */
	changeEditMode(field: string): void {
		switch (field) {
			case 'firstName':
				this.editEnabledFirstName = !this.editEnabledFirstName;
				break;
			case 'lastName':
				this.editEnabledLastName = !this.editEnabledLastName;
				break;
			case 'email':
				this.editEnabledEmail = !this.editEnabledEmail;
				break;
		}
	}

	/**
	 * Method that updates a value of the person's profile.
	 * @param field User profile field that has to be updated.
	 * @param value New value of passed user profile field.
	 * @return
	 */
	updateField(field: string, value: string): void {
		this.userService.updateUser(field, value).subscribe(data => {
			if (data.succes) {
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes'] }).afterDismissed().subscribe(() => {
					window.location.reload();
				});
			} else {
				this.snackBar.open('Er is iets fout gegaan, probeer het later opnieuw.', 'X', {
					duration: 2500,
					panelClass: ['style-error']
				}).afterDismissed().subscribe(() => {
					window.location.reload();
				});
			}
		});
	}
}

@Component({
	selector: 'delete-account-dialog',
	templateUrl: '../settings/delete-account-dialog.html'
})

export class DeleteAccountDialog {

	/**
	 * DeleteAccountDialog constructor.
	 * @param auth
	 * @param userService
	 * @param snackBar
	 * @param dialogRef
	 * @param data
	 */
	constructor(
		private auth: AuthenticationService,
		private userService: UserService,
		private snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<DeleteAccountDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }


	/**
	 * Method to delete a user's account.
	 * @return
	 */
	deleteAccount(): void {
		this.userService.deleteAccount().subscribe(data => {
			if (data.succes) {
				this.dialogRef.close();
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes'] }).afterDismissed().subscribe(() => {
					this.auth.logout();
				});
			}
		});
	}
}