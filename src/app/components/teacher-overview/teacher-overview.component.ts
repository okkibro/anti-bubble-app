/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/user';
import { FormBuilder, Validators } from '@angular/forms';
import { Class } from 'src/app/models/classes';
import { ClassesService } from 'src/app/services/classes.service';

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
    names = [];
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
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.auth.profile().subscribe(user => {
            this.userDetails = user;
            if (this.userDetails.class.length > 0) {
                this.classService.getClassIds().subscribe((ids) => {
                    this.classIds = ids.classIds;
                    this.getClass(this.classIds[0]._id);
                    this.getClassNames();
                });
            }
        });
    }

    /** Method to create a new class based on the filled in information of the form and join this class based on the result of the creation method. */
    createClass() {
        if (this.userDetails.role == 'teacher') {
            let classes = new Class();
            classes.code = Math.floor(100000 + Math.random() * 900000);;
            classes.level = this.classForm.get('classLevel').value;
            classes.title = this.classForm.get('classTitle').value;
            classes.year = this.classForm.get('classYear').value;
            this.openform = false;

            this.classService.createClass(classes, this.userDetails).subscribe((code: Number) => {
                this.classService.joinClass(code).subscribe((output) => {
                    if (output.succes) {
                        this.snackBar.open(output.message, 'X', { duration: 2500, panelClass: ['style-succes'], }).afterDismissed().subscribe(() => {
                            window.location.reload();
                        });
                    } else {
                        this.snackBar.open(output.message, 'X', { duration: 2500, panelClass: ['style-error'], });
                    }
                });
            });
        } else {
            console.log('You are not eligible to create a class.')
        }
    }

    /** Method to set the current class based on the id. */
    getClass(id): void {
        this.classService.getSingleClass(id).subscribe((output) => {
            if (output.succes) {
                this.currentClass = output.class;
                this.classmates = output.classmates;
            }
        });
    }

    /** Method to get all class names for a teacher. */
    getClassNames(): void {
        for (const id of this.classIds) {
            this.classService.getSingleClass(id._id).subscribe((output) => {
                if (output.succes) {
                    this.names.push({ title: output.class.title, id: id._id });
                }
                if (this.names.length == this.classIds.length) {
                    this.loading = false
                }
            });
        }
    }

    /** Method to update the html to display the correct class based on the id. */
    switchClass(id): void {
        this.getClass(id);
    }

    /** Method to change a boolean to unhide part of the html page */
    onClickSelectKlas() {
        this.selectklas = !this.selectklas;
    }

    /** Method to change a boolean to unhide part of the html page */
    onClickOpenForm() {
        this.openform = !this.openform;  
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */