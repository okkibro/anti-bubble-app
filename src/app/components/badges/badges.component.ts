/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * badges.component.ts
 * This file handles all the logic for displaying the user's milestone/badge collection.progression by
 * looking at their database entry.
 * @packageDocumentation
 */


import { Component, OnInit } from '@angular/core';
import { milestones } from '../../../../constants';
import { User } from '../../models/user';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'mean-badges',
	templateUrl: './badges.component.html',
	styleUrls: ['./badges.component.css',
		'../../shared/general-styles.css']
})

export class BadgesComponent implements OnInit {
	completed = [];
	uncompleted = [];
	userDetails: User;
	percentageComplete: string;

	/**
	 * BadgesComponent constructor.
	 * @param userService
	 * @param titleService
	 */
	constructor(private userService: UserService, private titleService: Title) { }

	/**
	 * Initialization method.
	 * @returns
	 */
	ngOnInit(): void {
		this.userService.profile().subscribe(user => {
			this.userDetails = user;

			// Loop over all milestones and sort them into the arrays.
			for (let i = 0; i < milestones.length; i++) {
				if (milestones[i].maxValue === user.milestones[i]) {
					this.completed.push({ index: i, milestone: milestones[i] });
				} else {
					this.uncompleted.push({ index: i, milestone: milestones[i] });
				}
			}

			// Set value of progressbar.
			this.percentageComplete = this.completedRatio();
		}, (err) => {
			console.error(err);
		});

		this.titleService.setTitle('Badges' + environment.TITLE_TRAIL);
	}

	/**
	 * Method to calculate how far you are in completing all milestones.
	 * @returns Percentage of milestones achieved.
	 */
	completedRatio(): string {
		return (this.completed.length / (this.completed.length + this.uncompleted.length) * 100).toFixed(0);
	}
}
