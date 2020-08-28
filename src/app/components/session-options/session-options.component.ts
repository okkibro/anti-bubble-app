/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * This file handles all the logic for teachers who want to create a session in the app. Different types
 * of games can be started so the createSession() method can handle a lot of different data.
 * @packageDocumentation
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { titleTrail } from '../../../../constants';
import { Activity } from '../../models/activity';
import { AuthenticationService } from '../../services/authentication.service';
import { SessionOverviewService } from '../../services/session-overview.service';

@Component({
	selector: 'mean-session-options',
	templateUrl: './session-options.component.html',
	styleUrls: ['./session-options.component.css',
		'../../shared/general-styles.css']
})

export class SessionOptionsComponent implements OnInit {
	activities: Activity[] = [];
	teamOptionForm = this.fb.group({
		teamOption: ['', Validators.required]
	});
	durationSliderForm = this.fb.group({
		durationSlider: ['', Validators.required]
	});

	/**
	 * SessionOptionsComponent constructor.
	 * @param auth
	 * @param router
	 * @param socketService
	 * @param sessionService
	 * @param fb
	 * @param titleService
	 * @param sessionOverviewService
	 */
	constructor(
		private auth: AuthenticationService,
		private router: Router,
		private socketService: SocketIOService,
		private sessionService: SessionService,
		private sessionOverviewService: SessionOverviewService,
		private fb: FormBuilder,
		private titleService: Title
	) { }

	/**
	 * Initialization method.
	 * @return
	 */
	ngOnInit(): void {

		// Get all the different activities from the database.
		this.getActivities();

		// Set page title.
		this.titleService.setTitle('Sessie opties' + titleTrail);
	}

	/**
	 * Method that fets called when teacher presses create session button. gamedata contains the name of the game and time of the slider.
	 * @param gameData All required data to start a session of one of the app's different types.
	 * @return
	 */
	createSession(gameData: any): void {

		// Get the entire activity data from the database
		this.sessionService.getActivity(gameData.game).subscribe(data => {
			gameData.game = data;

			// Create a session in socket io service and pass it the chosen activity with set options
			this.socketService.createSession(gameData);

			// Navigate to session page
			this.router.navigate(['session']);
		});
	}

	/**
	 * Method to get all the activities from the database so the teacher can filter between them.
	 * @return
	 */
	getActivities(): void {
		this.sessionOverviewService.getActivities().subscribe(data => {
			if (data.succes) {
				for (let activity of data.activities) {
					this.activities.push(activity);
				}
			}
		});
	}
}
