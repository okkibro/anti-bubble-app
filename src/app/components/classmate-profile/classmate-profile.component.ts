/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassesService } from 'src/app/services/classes.service';

@Component({
    selector: 'mean-classmate-profile',
    templateUrl: './classmate-profile.component.html',
    styleUrls: ['./classmate-profile.component.css',
        '../../shared/general-styles.css']
})
export class ClassmateProfileComponent implements OnInit {
    classmate: User;
    classmateClassTitle: string;

    constructor(
        private classService: ClassesService,
        private auth: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router)
    { }

    ngOnInit() {
        this.classService.classmateProfile(this.route.snapshot.paramMap.get('id')).subscribe(classmate => {
            this.classmate = classmate;

            // Get classmate's class
            this.classService.getClass().subscribe((data) => {
                if (data.succes) {
                    this.classmateClassTitle = data.class.title;
                }
            });
        }, (err) => {
            console.error(err);
            this.router.navigate(['/home']);
        });
    }
}