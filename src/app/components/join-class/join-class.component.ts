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
        '../../shared/general-styles.css']})

export class JoinClassComponent implements OnInit {
    classCodeField = this.fb.group({
        classCode: ['', []]
    });
    value;
    constructor(private fb: FormBuilder, private classesService: ClassesService, private snackBar: MatSnackBar) { }

    ngOnInit(): void {
    }

    /** Method to join a class based on the code you filled in. */
    joinClass(): void {
        this.classesService.joinClass(this.value).subscribe(data => {
            if (data.succes) {
                this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes'] }).afterDismissed().subscribe(()=>{
                    window.location.reload();
                });
            } else {
                this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-error'] });
            }
        });
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
