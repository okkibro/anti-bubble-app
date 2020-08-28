/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * This file handles all the logic for when a user visits the profile page of one of his classmates.
 * @packageDocumentation
 */

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassesService } from 'src/app/services/classes.service';
import { titleTrail } from '../../../../constants';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
	selector: 'mean-classmate-profile',
	templateUrl: './classmate-profile.component.html',
	styleUrls: ['./classmate-profile.component.css',
		'../../shared/general-styles.css']
})

export class ClassmateProfileComponent implements OnInit {
	classmate: User;
	classmateClassTitle: string;

	/**
	 * ClassmateProfileComponent constructor.
	 * @param classesService
	 * @param auth
	 * @param route
	 * @param router
	 * @param titleService
	 */
	constructor(
		private classesService: ClassesService,
		private auth: AuthenticationService,
		private route: ActivatedRoute,
		private router: Router,
		private titleService: Title
	) { }

	/**
	 * Initialization method.
	 * @return
	 */
	ngOnInit(): void {
		this.classesService.classmateProfile(this.route.snapshot.paramMap.get('id')).subscribe(classmate => {
			this.classmate = classmate;

			// Get classmate's class
			this.classesService.getClass().subscribe(data => {
				if (data.succes) {
					this.classmateClassTitle = data.class.title;
				}
			});
		}, (err) => {
			console.error(err);
			this.router.navigate(['/home']);
		});

		// Set page title.
		this.titleService.setTitle('Klasgenoot profiel' + titleTrail);
	}
}