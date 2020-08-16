/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ClassesService } from '../../services/classes.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'mean-join-class',
	templateUrl: './join-class.component.html',
	styleUrls: ['./join-class.component.css',
		'../../shared/general-styles.css']
})

export class JoinClassComponent implements OnInit {
	joinClassForm = this.fb.group({
		code: ['', []]
	});

	constructor(private fb: FormBuilder, private classesService: ClassesService, private snackBar: MatSnackBar) {
	}

	ngOnInit(): void {
	}

	/** Method to join a class based on the code you filled in. */
	joinClass(): void {
		this.classesService.joinClass(this.joinClassForm.get('code').value).subscribe(data => {
			if (data.succes) {
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes'] }).afterDismissed().subscribe(() => {
					window.location.reload();
				});
			} else {
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-error'] });
			}
		});
	}

	/** Method that makes sure you can only fill in numbers in the session code input field. */
	check(event: KeyboardEvent) {
		let code = event.code.charCodeAt(0);
		if (code != 68) {
			event.preventDefault();
		}
	}
}
