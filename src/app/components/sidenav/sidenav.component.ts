/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * sidenav.component.ts
 * This file contains all the logic and methods used by the sidenav (mobile toolbar).
 * @packageDocumentation
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { tokenData } from '../../models/tokenData';

@Component({
	selector: 'mean-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.css',
		'../../shared/general-styles.css']
})

export class SidenavComponent implements OnInit {
	@Output() public sidenavClose = new EventEmitter();

	tokenData: tokenData;

	/**
	 * SidenavComponent constructor.
	 * @param auth
	 */
	constructor(private auth: AuthenticationService) { }

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
	logoutButton() {
		return this.auth.logout();
	}

	/**
	 * Method that closes the sidenav when the user presses a button/link in the sidenav.
	 * @returns
	 */
	public onSidenavClose = (): void => {
		this.sidenavClose.emit();
	};
}
