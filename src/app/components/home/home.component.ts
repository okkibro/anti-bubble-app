/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * home.component.ts
 * This file handles all the logic for displaying the home screen of the app. This file mainly consists of the joinSession()
 * form which is needed for students to join a session created by a teacher.
 * @packageDocumentation
 */

import { Component, OnInit } from '@angular/core';
import { SocketIOService } from '../../services/socket-io.service';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data-exchange.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { beforeUnload, milestones, earnAmount } from '../../../../constants';
import { SessionService } from 'src/app/services/session.service';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { UserService } from '../../services/user.service';
import { MilestoneUpdatesService } from '../../services/milestone-updates.service';

@Component({
	selector: 'mean-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css',
		'../../shared/general-styles.css']
})

export class HomeComponent implements OnInit {
	userDetails: User;
	joinSessionForm = this.fb.group({
		pin: ['', Validators.required]
	});

	/**
	 * HomeComponent constructor.
	 * @param socketService
	 * @param fb
	 * @param router
	 * @param data
	 * @param snackBar
	 * @param sessionService
	 * @param titleService
	 * @param userService
	 * @param milestoneUpdates
	 */
	constructor(
		private socketService: SocketIOService,
		private fb: FormBuilder,
		private router: Router,
		private data: DataService,
		private snackBar: MatSnackBar,
		private sessionService: SessionService,
		private titleService: Title,
		private userService: UserService,
		private milestoneUpdates: MilestoneUpdatesService
	) { }

	/**
	 * Initialization method.
	 * @returns
	 */
	ngOnInit(): void {
		this.userService.profile().subscribe(user => {
			this.userDetails = user;
		});

		this.titleService.setTitle('Home' + environment.TITLE_TRAIL);
	}

	/**
	 * Method to join a session based on the filled in code. Uses the joinSession() method declared in the
	 * socketIOService. The required backToHome(), redirect() and finishedGame() methods are defined here.
	 * @returns
	 */
	joinSession() {
		const user = this.userDetails;

		// Call the joinsession function in socketio service and define all callbacks.
		this.socketService.joinSession(this.joinSessionForm.get('pin').value, user, (succes) => {

			// Join callback: succes returns true if pin was correct and false when pin is incorrect.
			if (succes) {

				// On join succes, go to session page.
				this.router.navigate(['session']);
			} else {

				// On join fail, show error message.
				this.snackBar.open('Er is iets mis gegaan, check de code en probeer het opnieuw', 'X', { duration: 2500, panelClass: ['style-error'] });
			}
		}, () => {

			// backToHome callback: show message that host left and navigate to home page afterwards.
			this.snackBar.open('De host heeft de sessie verlaten, je wordt naar de home pagina geleid', 'X', {
				duration: 2500,
				panelClass: ['style-warning']
			}).afterDismissed().subscribe(() => {
				this.router.navigate(['home']);
			});
			window.removeEventListener('beforeunload', beforeUnload);
		}, () => {

			// redirect callback: go to activities page when the game starts.
			this.router.navigate(['activities']);
		}, () => {

			// finishedGame callback: earn money and process milestones
			this.sessionService.earnMoney(earnAmount).subscribe();
			this.milestoneUpdates.updateMilestone(milestones[1], earnAmount).subscribe(data => {
				if (data.completed) {
					this.milestoneUpdates.updateRecent(`${new Date().toLocaleDateString()}: Je hebt de badge 'Kleine Spaarder' verdiend!`).subscribe();
					this.snackBar.open('\uD83C\uDF89 Gefeliciteerd! Je hebt de badge \'Kleine Spaarder\' verdiend! \uD83C\uDF89', 'X', {
						duration: 4000,
						panelClass: ['style-succes']
					});
				}
			});
			this.milestoneUpdates.updateMilestone(milestones[7], earnAmount).subscribe(data => {
				if (data.completed) {
					this.milestoneUpdates.updateRecent(`${new Date().toLocaleDateString()}: Je hebt de badge 'Money Maker' verdiend!`).subscribe();
					this.snackBar.open('\uD83C\uDF89 Gefeliciteerd! Je hebt de badge \'Money Maker\' verdiend! \uD83C\uDF89', 'X', {
						duration: 4000,
						panelClass: ['style-succes']
					});
				}
			});
		});
	}

	/**
	 * Method that makes sure you can only fill in numbers in the session code input field.
	 * @param event Event triggered when a key is pressed in the join session input.
	 * @returns
	 */
	check(event: KeyboardEvent) {
		let code = event.code.charCodeAt(0);
		if (code != 68) {
			event.preventDefault();
		}
	}
}
