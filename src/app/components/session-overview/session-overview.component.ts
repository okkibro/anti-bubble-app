/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 *  within the Software Project course. © Copyright Utrecht University (Department of Information and
 *  Computing Sciences)
 */

/**
 * session-overview.component.ts
 * This file contains all the logic to enable teachers to look at recorded sessions from students and filter
 * through them using a handful of predetermined filter options.
 * @packageDocumentation
 */

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { titleTrail } from '../../../../constants';
import { Log } from '../../models/log';
import { SessionOverviewService } from '../../services/session-overview.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
	selector: 'mean-session-overview',
	templateUrl: './session-overview.component.html',
	styleUrls: ['./session-overview.component.css',
		'../../shared/general-styles.css']
})

export class SessionOverviewComponent implements OnInit {
	logs: Log[] = [];
	originalLogs: Log[] = [];
	displayedLogs: Log[] = [];
	classes = [];
	students = [];
	activities = [];
	filters = {
		class: [],
		gender: [],
		activity: [],
		user: [],
		comparisonDate: []
	};
	genders = [
		{ value: 'male', name: 'Jongen' },
		{ value: 'female', name: 'Meisje' }];
	startDate;
	pageIndex = 0;
	pageSize = 1;
	pageSizeOptions: number[] = [1, 2, 5, 10, 25, 100];

	/**
	 * SessionOverviewComponent constructor.
	 * @param sessionOverviewService
	 * @param titleService
	 */
	constructor(private sessionOverviewService: SessionOverviewService, private titleService: Title) { }

	/**
	 * Initialization method.
	 * @return
	 */
	ngOnInit(): void {

		// Get all the activities from the database.
		this.getActivities();

		// Get all the session logs and supplementary data from the database.
		this.getLogs();

		// Set page title.
		this.titleService.setTitle('Sessie overzicht' + titleTrail);
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

	/**
	 * Method to get all the session logs from the database based on certain user specified filters.
	 * @return
	 */
	getLogs(): void {
		this.sessionOverviewService.getLogs().subscribe(data => {
			if (data.succes) {
				for (let log of data.logs) {
					let dates = this.convertObjectIdToDate(log._id);
					log.comparisonDate = dates[0];
					log.date = dates[1];
					this.logs.push(log);
				}
				this.students = data.students;
				this.classes = data.classes;


				// Replace ObjectIds of users, classes and activities in the logs with their actual objects so they can
				// be accessed more easily in the HTML of the component.
				for (let log of this.logs) {
					let userIndex = this.students.findIndex(x => x._id === log.user);
					let classIndex = this.classes.findIndex(y => y._id === log.class);
					let activityIndex = this.activities.findIndex(z => z._id === log.activity);
					log.user = this.students[userIndex];
					log.class = this.classes[classIndex];
					log.activity = this.activities[activityIndex];
				}
			}

			this.displayedLogs = this.logs.slice(0, this.pageSize);

			// Make a deep copy of the logs from the database that we will use when filtering logs
			// in the filterLogs(0 method.
			this.logs.forEach(log => this.originalLogs.push(Object.assign({}, log)));
		});
	}

	/**
	 * Method to transform ObjectId of a session log to a date.
	 * @param objectId ObjectId of log.
	 * @return Timestamp of when the log was entered into the database.
	 */
	convertObjectIdToDate(objectId: string): string[] {
		const dateObject = new Date(parseInt(objectId.substring(0, 8), 16) * 1000);

		// comparisonDate is a date with special formatting used in the filterLogs() method to filter logs based on the date
		// they were entered into the database. The other date is a more readable format used for displaying to the user.
		const comparisonDate = (dateObject.getUTCMonth() + 1) + '/' + dateObject.getUTCDate() + '/' + dateObject.getFullYear();
		const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
		const date = dateObject.toLocaleString('nl-NL', options)
		return [comparisonDate, date];
	}

	/**
	 * Method to update session log filter and update displayed logs.
	 * @param event MatOptionSelectionChange event triggered by user (un)selecting an option in the MatSelect.
	 * @param param The parameter to filter on or remove from the filters.
	 * @param value The value to filter on or remove from the filters.
	 * @param dateReset Whether the method was called by resetting the date.
	 * @return
	 */
	filterLogs(event: any = null, param: string = null, value: string | unknown = null, dateReset: boolean): void {

		// Empty the logs that were displayed to the user and deep copy back the orginally found logs in the
		// getLogs() method so we can work with the original set, without accessing the database again/needing
		// to refresh the page.
		this.logs = [];
		this.originalLogs.forEach(log => this.logs.push(Object.assign({}, log)));

		// Check if the method was triggered by resetting the date, or in any other way and act accordingly.
		if (dateReset) {
			this.startDate = null;
			this.filters['comparisonDate'].pop();
		} else {

			// Check if the event that was submitted came from the MatDatePicker (if-statement) or from the
			// MatOptionSelectionChange (else if/else-statements). If it was for checking a checkbox in the
			// select, then add the param-value pair to this filters and if it was for unchecking a checkbox
			// in the select, then remove the param-value pair from this.filters.
			if (typeof value !== 'string') {

				// Convert date given in the event from the MatDatPicker to a date that is the same format as the
				// previously set comparisonDate in the getLogs() method.
				value = value.toLocaleString().slice(0, 9)
				this.filters[param].push(value);
			} else if (event.source._selected) {
				this.filters[param].push(value);
			} else {
				this.filters[param].splice(this.filters[param].indexOf(value), 1);
			}
		}

		// Loop through all the param-value pairs in this.filters.
		for (let [param, values]  of Object.entries(this.filters)) {

			// Skip a param-value pair when its length is 0 (i.e. it hasn't been selected by the user so we don't
			// need to filter for it).
			if (values.length === 0) {
				continue;
			}

			// Loop through this.logs and use a for (...; ...; ...) loop instead of a for (let ... of ...) loop
			// since we will be removing element from this.logs in the for loop itself and the loop variable will
			// give let us know when we need to stop.
			for (let i = 0; i < this.logs.length; i++) {

				// Get the index of the first log that doesn't adhere to the filters set by the user and remove
				// the log with the found index (if one is found). findIndex() will return -1 if no log is
				// found and an index larger than -1 if it is found. Based on which of the 5 filters we are
				// applying, we need to look at different pasrts of the log.
				let index = 0;
				if (param === 'user' || param === 'activity' || param === 'class') {
					index = this.logs.findIndex(log => !values.includes(log[param]._id));
				} else if (param === 'comparisonDate') {
					index = this.logs.findIndex(log => !values.includes(log['comparisonDate']));
				} else if (param === 'gender') {
					index = this.logs.findIndex(log => !values.includes(log.user.gender));
				}
				if (index > -1) {
					this.logs.splice(index, 1);
					i--;
				}
			}
		}

		this.displayedLogs = this.logs;
	}

	changePage(event: PageEvent): void {
		const start = event.pageIndex * event.pageSize;
		const end = (event.pageIndex + 1) * event.pageSize;
		this.displayedLogs = this.logs.slice(start, end);
	}
}
