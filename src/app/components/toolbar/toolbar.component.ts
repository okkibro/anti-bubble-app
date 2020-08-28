/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * This file contains all the logic and methods used by the horizontal toolbar shown in 'desktop mode'.
 * The logout button in fetched and a method for toggling the sidebar is included.
 * @packageDocumentation
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { tokenData } from 'src/app/models/tokenData';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
	selector: 'mean-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.css',
		'../../shared/general-styles.css']
})

export class ToolbarComponent implements OnInit {
	@Output() public sidenavToggle = new EventEmitter();

	tokenData: tokenData;
	toolbarRatio: number;

	/**
	 * ToolbarComponent constructor.
	 * @param auth
	 */
	constructor(private auth: AuthenticationService) {}

	/**
	 * Initialization method.
	 * @return
	 */
	ngOnInit(): void {
		this.tokenData = this.auth.getTokenData();

		// Calculated by dividing 100 by the amount of links for a certain role plus 2 for the
		// offset for the home and login buttons.
		if (this.tokenData.role === 'teacher') {
			this.toolbarRatio = 10;
		} else if (this.tokenData.role === 'student') {
			this.toolbarRatio = 11.1;
		}
	}

	/**
	 * Method to logout the current user.
	 * @return
	 */
	logoutButton(): void {
		return this.auth.logout();
	}

	/**
	 * Method that toggles the sidebar in/out when it is running in 'mobile' mode.
	 * @return
	 */
	public onToggleSidenav = (): void => {
		this.sidenavToggle.emit();
	};
}
