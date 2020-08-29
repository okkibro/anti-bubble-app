/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Class } from 'src/app/models/class';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ClassesService } from 'src/app/services/classes.service';
import { titleTrail } from '../../../../constants';
import { UserService } from '../../services/user.service';

/**
 * This class handles all the logic for the class-overview for a teacher. The class contains methods for
 * creating a class, switching between teacher owned classes and displaying all the class members
 * of the selected class. Class contains two helper methods for opening MatDialogs for kicking students
 * out of a class and deleting a class, defined as sub-components in the file.
 */
@Component({
	selector: 'teacher-overview-component',
	templateUrl: './teacher-overview.component.html',
	styleUrls: ['./teacher-overview.component.css',
		'../../shared/general-styles.css']
})

export class TeacherOverviewComponent implements OnInit {
	public userDetails: User;
	private classIds = [];
	public classes = [];
	public currentClass;
	public classmates: User[];
	public classForm = this.fb.group({
		classTitle: ['', Validators.required],
		classLevel: ['', Validators.required],
		classYear: ['', Validators.required]
	});
	public openform = false;
	private selectklas = false;

	/**
	 * TeacherOverviewComponent constructor.
	 * @param auth
	 * @param classesService
	 * @param fb
	 * @param snackBar
	 * @param dialog
	 * @param titleService
	 * @param userService
	 */
	constructor(
		private auth: AuthenticationService,
		private classesService: ClassesService,
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
		private titleService: Title,
		private userService: UserService
	) { }

	/**
	 * Initialization method.
	 * @return
	 */
	public ngOnInit(): void {
		this.userService.profile().subscribe(user => {
			this.userDetails = user;
			if (this.userDetails.classArray.length > 0) {
				this.classesService.getClassIds().subscribe((ids) => {
					this.classIds = ids.classIds;
					this.setClass(this.classIds[0]._id);
					this.getClasses();
				});
			}
		});

		// Set page title.
		this.titleService.setTitle('Docent overzicht' + titleTrail);
	}

	/**
	 * Method to create a new class based on the filled in information of the form and join this class based on the result of the creation method.
	 * @return
	 */
	public createClass(): void {
		if (this.userDetails.role === 'teacher') {
			let klas = new Class();
			klas.code = Math.floor(100000 + Math.random() * 900000);
			klas.level = this.classForm.get('classLevel').value;
			klas.title = this.classForm.get('classTitle').value;
			klas.year = this.classForm.get('classYear').value;
			this.openform = false;

			this.classesService.createClass(klas, this.userDetails).subscribe(data => {
				this.classesService.joinClass(data.code).subscribe((output) => {
					if (output.succes) {
						this.snackBar.open(output.message, 'X', { duration: 2500, panelClass: ['style-succes'] }).afterDismissed().subscribe(() => {
							window.location.reload();
						});
					} else {
						this.snackBar.open(output.message, 'X', { duration: 2500, panelClass: ['style-error'] });
					}
				});
			});
		}
	}

	/**
	 * Method to set the current class based on the id.
	 * @param id ID of class to be shown on screen and set as current class for teacher.
	 */
	private setClass(id: string): void {
		this.classesService.getSingleClass(id).subscribe((output) => {
			if (output.succes) {
				this.currentClass = output.class;
				this.classmates = output.classmates;
			}
		});
	}

	/**
	 * Method to get all classes for a teacher.
	 * @return
	 */
	private getClasses(): void {
		for (let id of this.classIds) {
			this.classesService.getSingleClass(id._id).subscribe((output) => {
				if (output.succes) {
					this.classes.push({ title: output.class.title, id: id._id });
				}
			});
		}
	}

	/** Method to update the html to display the correct class based on the ID.
	 * @param id ID of class that has to be switched out with current class ID.
	 */
	public switchClass(id: string): void {
		this.setClass(id);
		this.onClickSelectKlas();
	}

	/**
	 * Method to change a boolean to unhide part of the html page.
	 * @return
	 */
	public onClickSelectKlas(): void {
		this.selectklas = !this.selectklas;
	}

	/**
	 * Method to change a boolean to unhide part of the html page.
	 * @return
	 */
	public onClickOpenForm(): void {
		this.openform = !this.openform;
	}

	/**
	 * Method that opens the delete class dialog.
	 * @return
	 */
	public openDeleteClassDialog(): void {
		this.dialog.open(DeleteClassDialog, { data: { klas: this.currentClass }});
	}

	/**
	 * Method that opens the remove student from class dialog.
	 * @param user User that has to be removed from the current class.
	 * @return
	 */
	public openRemoveFromClassDialog(user: User): void {
		this.dialog.open(RemoveFromClassDialog, { data: { user: user, klas: this.currentClass, leaving: false }});
	}
}

/**
 * This class is defined as a sub-component of the TeacherOverviewComponent and handles the MatDialog for when a teacher
 * wants to delete a class.
 */
@Component({
	selector: 'delete-class-dialog',
	templateUrl: 'delete-class-dialog.html'
})

export class DeleteClassDialog {

	/**
	 * DeleteClassDialog constructor.
	 * @param classesService
	 * @param dialog
	 * @param dialogRef
	 * @param snackBar
	 * @param data
	 */
	constructor(
		private classesService: ClassesService,
		private dialog: MatDialog,
		private dialogRef: MatDialogRef<DeleteClassDialog>,
		private snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }


	/**
	 * Method to delete a user's account.
	 * @return
	 */
	public deleteClass(): void {
		this.classesService.deleteClass(this.data.klas._id).subscribe(data => {
			if (data.succes) {
				this.dialogRef.close();
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes'] }).afterDismissed().subscribe(() => {
					window.location.reload();
				});
			} else {
				this.snackBar.open('Er is iets fout gegaan, probeer het later opnieuw.', 'X', { duration: 2500, panelClass: ['style-error'] });
			}
		});
	}
}

/**
 * This class is defined as a sub-component of the TeacherOverviewComponent and handles the MatDialog for when a teacher
 * wants to remove a students from the currently displayed class.
 */
@Component({
	selector: 'remove-from-class-dialog',
	templateUrl: 'remove-from-class-dialog.html'
})

export class RemoveFromClassDialog {

	/**
	 * RemoveFromClassDialog constructor.
	 * @param classesService
	 * @param dialog
	 * @param dialogRef
	 * @param snackBar
	 * @param data
	 */
	constructor(
		private classesService: ClassesService,
		private dialog: MatDialog,
		private dialogRef: MatDialogRef<DeleteClassDialog>,
		private snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }


	/**
	 * Method to remove a student from the current class.
	 * @return
	 */
	public removeFromClass(): void {
		this.classesService.leaveClass(this.data.user._id, this.data.klas._id, this.data.leaving).subscribe(data => {
			if (data.succes) {
				this.dialogRef.close();
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes'] }).afterDismissed().subscribe(() => {
					window.location.reload();
				});
			} else {
				this.snackBar.open('Er is iets fout gegaan, probeer het later opnieuw.', 'X', { duration: 2500, panelClass: ['style-error'] });
			}
		});
	}
}