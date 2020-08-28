/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * This file is just for the toolbar that is shown when a visitor is not logged in.
 * @packageDocumentation
 */

import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'mean-not-logged-in-toolbar',
	templateUrl: './not-logged-in-toolbar.component.html',
	styleUrls: ['./not-logged-in-toolbar.component.css',
		'../../shared/general-styles.css']
})

export class NotLoggedInToolbarComponent implements OnInit {

	/**
	 * NotLoggedInToolbarComponent constructor.
	 */
	constructor() { }

	/**
	 * Initialization method.
	 * @return
	 */
	ngOnInit(): void { }
}
