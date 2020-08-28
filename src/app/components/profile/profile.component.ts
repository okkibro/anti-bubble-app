/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * profile.component.ts
 * This file handles all the logic for collecting all the information necessary for displaying the user's
 * profile. The component is not the same for teachers and students, but the ngOnInit() method is.
 * @packageDocumentation
 */

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Milestone } from 'src/app/models/milestone';
import { ClassesService } from 'src/app/services/classes.service';
import { milestones, titleTrail } from '../../../../constants';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'mean-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css',
		'../../shared/general-styles.css']
})

export class ProfileComponent implements OnInit {
	userDetails: User;
	milestoneShown: Milestone;
	userClassTitle: string;

	/**
	 * ProfileComponent constructor.
	 * @param snackBar
	 * @param classesService
	 * @param router
	 * @param titleService
	 * @param userService
	 */
	constructor(
		private snackBar: MatSnackBar,
		private classesService: ClassesService,
		private router: Router,
		private titleService: Title,
		private userService: UserService
	) { }

	/**
	 * Initialization method.
	 * @return
	 */
	ngOnInit(): void {

		// Milestone that gets shown when you have all badges.
		this.milestoneShown = {
			name: 'Gefeliciteerd',
			description: 'Je hebt alle badges gehaald',
			index: 0,
			maxValue: 0
		};

		// Get user's class
		this.classesService.getClass().subscribe(data => {
			if (data.succes) {
				this.userClassTitle = data.class.title;
			}
		});

		this.userService.profile().subscribe(user => {
			this.userDetails = user;

			// Loop over all milestones and find the one with the most progress that the user didnt complete yet.
			for (let i = 0; i < milestones.length; i++) {
				if (user.milestones[i] != milestones[i].maxValue && user.milestones[i] >= user.milestones[this.milestoneShown.index]) {
					this.milestoneShown = milestones[i];
				}
			}
		}, (err) => {
			console.error(err);
		});

		// Set page title.
		this.titleService.setTitle('Profiel' + titleTrail);
	}
}