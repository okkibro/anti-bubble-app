/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * toolbar.component.ts
 * This file contains all the logic and methods used by the toolbar (desktop mode).
 * @packageDocumentation
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { tokenData } from 'src/app/models/tokenData';

@Component({
	selector: 'mean-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.css',
		'../../shared/general-styles.css']
})

export class ToolbarComponent implements OnInit {
	@Output() public sidenavToggle = new EventEmitter();

	tokenData: tokenData;

	/**
	 * ToolbarComponent constructor.
	 * @param auth
	 */
	constructor(private auth: AuthenticationService) {}

	/**
	 * Initialization method.
	 * @returns
	 */
	ngOnInit(): void {
		this.tokenData = this.auth.getTokenData();
	}

	/**
	 * Method to logout the current user.
	 * @returns
	 */
	logoutButton(): void {
		return this.auth.logout();
	}

	/**
	 * Method that toggles the sidebar in/out when it is running in 'mobile' mode.
	 * @returns
	 */
	public onToggleSidenav = (): void => {
		this.sidenavToggle.emit();
	};
}
