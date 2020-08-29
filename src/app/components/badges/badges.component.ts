/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * @packageDocumentation
 * @module Components
 */
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { milestones, titleTrail } from '../../../../constants';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

/**
 * This class handles all the logic for displaying the user's milestone/badge collection.progression by
 * looking at their database entry.
 */
@Component({
	selector: 'badges-component',
	templateUrl: './badges.component.html',
	styleUrls: ['./badges.component.css',
		'../../shared/general-styles.css']
})

export class BadgesComponent implements OnInit {
	public completed = [];
	public uncompleted = [];
	public userDetails: User;
	public percentageComplete: string;

	/**
	 * BadgesComponent constructor.
	 * @param userService
	 * @param titleService
	 */
	constructor(private userService: UserService, private titleService: Title) { }

	/**
	 * Initialization method.
	 * @return
	 */
	public ngOnInit(): void {
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

		// Set page title.
		this.titleService.setTitle('Badges' + titleTrail);
	}

	/**
	 * Method to calculate how far you are in completing all milestones.
	 * @return Percentage of milestones achieved.
	 */
	public completedRatio(): string {
		return (this.completed.length / (this.completed.length + this.uncompleted.length) * 100).toFixed(0);
	}
}
