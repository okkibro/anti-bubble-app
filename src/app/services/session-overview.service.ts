/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 *  within the Software Project course. © Copyright Utrecht University (Department of Information and
 *  Computing Sciences)
 */

/**
 * session-overview.service.ts
 * This file sends all HTTP requests for getting session logs from the database based on user decided filters.
 * @packageDocumentation
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})

export class SessionOverviewService {

	/**
	 * SessionOverviewService constructor.
	 * @param http
	 * @param cookie
	 */
	constructor(private http: HttpClient, private cookie: CookieService) { }

	/**
	 * Method to do a GET request to get session logs from the database based on certain user specified filters.
	 * @return HTTP response data in an Observable.
	 */
	public getLogs(): Observable<any> {
		return this.http.get(`${environment.ENDPOINT}/session/getLogs`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}

	/**
	 * Method to do a GET request to get all the different activities from the database.
	 * @return HTTP response data in an Observable.
	 */
	public getActivities(): Observable<any> {
		return this.http.get(`${environment.ENDPOINT}/session/activities`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}
}
