/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, Inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { FormBuilder } from '@angular/forms';
import { ClassesService } from '../../services/classes.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DeleteClassDialog } from "../teacher-overview/teacher-overview.component";

@Component({
    selector: 'mean-class-overview',
    templateUrl: './class-overview.component.html',
    styleUrls: ['./class-overview.component.css',
        '../../shared/general-styles.css']
})

export class ClassOverviewComponent implements OnInit {
    searchBar = this.fb.group({
        query: ['', []]
    });

    classmates: User[];
    userClass;
    userDetails: User;

    public value: string;

    constructor(
        private classService: ClassesService,
        private auth: AuthenticationService,
        private router: Router,
        private fb: FormBuilder,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.auth.profile().subscribe(user => {
            this.userDetails = user;
        })
        this.classService.getClass().subscribe((data) => {
            if (data.succes) {
                this.userClass = data.class;
                this.classmates = data.classmates;
            }
        });
    }

    /** Method to filter the students in a class. */
    search() {
        let query: string = this.searchBar.get('query').value.toLowerCase();
        let table = document.getElementById('table').childNodes;
        for (let i: number = 0; i < this.classmates.length; i++) {
            if (this.classmates[i].firstName.toLowerCase().includes(query) || this.classmates[i].lastName.toLowerCase().includes(query)) {
                (table[i + 1] as HTMLElement).style.display = '';
            } else {
                (table[i + 1] as HTMLElement).style.display = 'none';
            }
        }
    }

    /** Method to clear the filter so all students are displayed again. */
    clear() {
        this.value = '';
        let table = document.getElementById('table').childNodes;
        for (let i: number = 0; i < this.classmates.length; i++) {
            (table[i + 1] as HTMLElement).style.display = '';
        }
    }

    /** Method that opens the leave class dialog. */
    openLeaveClassDialog() {
        this.dialog.open(LeaveClassDialog, { data: { userId: this.userDetails._id, classId: this.userClass._id, classTitle: this.userClass.title, leaving: true }});
    }
}

@Component({
    selector: 'leave-class-dialog',
    templateUrl: 'leave-class-dialog.html',
})

export class LeaveClassDialog {

    constructor(
        private classService: ClassesService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<LeaveClassDialog>,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    /** Method to leave your class. */
    leaveClass() {
        this.classService.leaveClass(this.data.userId, this.data.classId, this.data.leaving).subscribe(data => {
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
