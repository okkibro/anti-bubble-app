/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/user';
import { FormBuilder, Validators } from '@angular/forms';
import { Class } from 'src/app/models/classes';
import { ClassesService } from 'src/app/services/classes.service';
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DeleteAccountDialog } from "../profile/profile.component";

@Component({
    selector: 'mean-teacher-overview',
    templateUrl: './teacher-overview.component.html',
    styleUrls: ['./teacher-overview.component.css',
        '../../shared/general-styles.css']
})

export class TeacherOverviewComponent implements OnInit {
    userDetails: User;
    loading = true;
    classIds = [];
    classes = [];
    currentClass;
    classmates: User[];
    classForm = this.fb.group({
        classTitle: ['', Validators.required],
        classLevel: ['', Validators.required],
        classYear: ['', Validators.required]
    });
    openform = false;
    selectklas = false;

    constructor(
        private auth: AuthenticationService,
        private classService: ClassesService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.auth.profile().subscribe(user => {
            this.userDetails = user;
            if (this.userDetails.classArray.length > 0) {
                this.classService.getClassIds().subscribe((ids) => {
                    this.classIds = ids.classIds;
                    this.setClass(this.classIds[0]._id);
                    this.getClasses();
                });
            }
        });
    }

    /** Method to create a new class based on the filled in information of the form and join this class based on the result of the creation method. */
    createClass() {
        if (this.userDetails.role == 'teacher') {
            let klas = new Class();
            klas.code = Math.floor(100000 + Math.random() * 900000);
            klas.level = this.classForm.get('classLevel').value;
            klas.title = this.classForm.get('classTitle').value;
            klas.year = this.classForm.get('classYear').value;
            this.openform = false;

            this.classService.createClass(klas, this.userDetails).subscribe((data) => {
                this.classService.joinClass(data.code).subscribe((output) => {
                    if (output.succes) {
                        this.snackBar.open(output.message, 'X', { duration: 2500, panelClass: ['style-succes'] }).afterDismissed().subscribe(() => {
                            if (this.classIds.length > 0) {
                                this.switchClass(data.id);
                            } else {
                                window.location.reload();
                            }
                        });
                    } else {
                        this.snackBar.open(output.message, 'X', { duration: 2500, panelClass: ['style-error'] });
                    }
                });
            });
        }
    }

    /** Method to set the current class based on the id. */
    setClass(id): void {
        this.classService.getSingleClass(id).subscribe((output) => {
            if (output.succes) {
                this.currentClass = output.class;
                this.classmates = output.classmates;
            }
        });
    }

    /** Method to get all classes for a teacher. */
    getClasses(): void {
        for (let id of this.classIds) {
            this.classService.getSingleClass(id._id).subscribe((output) => {
                if (output.succes) {
                    this.classes.push({ title: output.class.title, id: id._id });
                }
                if (this.classes.length == this.classIds.length) {
                    this.loading = false
                }
            });
        }
    }

    /** Method to update the html to display the correct class based on the id. */
    switchClass(id): void {
        this.setClass(id);
        this.onClickSelectKlas();
    }

    /** Method to change a boolean to unhide part of the html page */
    onClickSelectKlas(): void {
        this.selectklas = !this.selectklas;
    }

    /** Method to change a boolean to unhide part of the html page */
    onClickOpenForm(): void {
        this.openform = !this.openform;  
    }

    /** Method that opens the delete class dialog. */
    openDeleteClassDialog() {
        this.dialog.open(DeleteClassDialog, { data: { classToDelete: this.currentClass }});
    }
}

@Component({
    selector: 'delete-class-dialog',
    templateUrl: 'delete-class-dialog.html',
})

export class DeleteClassDialog {

    constructor(
        private classService: ClassesService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<DeleteClassDialog>,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { }

    /** Method to delete a user's account. */
    deleteClass() {
        this.classService.deleteClass(this.data.classToDelete._id).subscribe(data => {
            if (data.succes) {
                this.dialogRef.close();
                this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes']}).afterDismissed().subscribe(() => {
                    window.location.reload();
                });
            } else {
                this.snackBar.open('Er is iets fout gegaan, probeer het later opnieuw.', 'X', { duration: 2500, panelClass: ['style-error']});
            }
        })
    }

    /** Method to close the dialog. */
    closeDialog(): void {
        this.dialogRef.close();
    }
}