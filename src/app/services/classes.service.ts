/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * This file sends all HTTP requests related to classes in the app. HTTP request methods for creating, deleting
 * getting, leaving and joining classes are in this file.
 * @packageDocumentation
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Class } from '../models/class';
import { User } from '../models/user';

@Injectable({
	providedIn: 'root'
})

export class ClassesService {

	/**
	 * ClassesService constructor.
	 * @param http
	 * @param cookie
	 */
	constructor(private http: HttpClient, private cookie: CookieService) { }

	/**
	 * Method to do a POST request to create a new class in the database.
	 * @param klas Class to be created.
	 * @param teacher User that is to be the teacher of the class.
	 * @return HTTP response data in an Observable.
	 */
	public createClass(klas: Class, teacher: User): Observable<any> {
		return this.http.post(`${environment.ENDPOINT}/class/createClass`, {
			classes: klas,
			teacher: teacher
		}, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}

	/**
	 * Method to do a POST request to join an existing class based on the given code.
	 * @param code ID of class user wants to join.
	 * @return HTTP response data in an Observable.
	 */
	public joinClass(code: number): Observable<any> {
		return this.http.post(`${environment.ENDPOINT}/class/joinClass`, { code: code }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}

	/**
	 * Method to do a GET request to get the class the user is in. In case of a teacher this returns the first class in the class list of teacher.
	 * @return HTTP response data in an Observable.
	 */
	public getClass(): Observable<any> {
		return this.http.get(`${environment.ENDPOINT}/class/getClass`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}

	/**
	 * Method to do a GET request to get all the class ids in the class list of a user (only used for teachers).
	 * @return HTTP response data in an Observable.
	 */
	public getClassIds(): Observable<any> {
		return this.http.get(`${environment.ENDPOINT}/class/getClassIds`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}

	/**
	 * Method to do a GET request to get a single class based on the id (used to load all classes in the class list of a teacher).
	 * @param id ID of class data is necessary from.
	 * @return HTTP response data in an Observable.
	 */
	public getSingleClass(id: string): Observable<any> {
		return this.http.get(`${environment.ENDPOINT}/class/getSingleClass/${id}`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}

	/**
	 * Method to do a GET request to get the profile of a classmate.
	 * @param id ID of user profile classmate wants to see.
	 * @return HTTP response data in an Observable.
	 */
	public classmateProfile(id: string): Observable<any> {
		return this.http.get(`${environment.ENDPOINT}/class/classmateProfile/${id}`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}

	/**
	 * Method to do a DELETE request to delete a class.
	 * @param id ID of class getting deleted.
	 * @return HTTP response data in an Observable.
	 */
	public deleteClass(id: string): Observable<any> {
		return this.http.delete(`${environment.ENDPOINT}/class/deleteClass/${id}`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}

	/**
	 * Method to do a PATCH request to leave class.
	 * @param userId ID of user leaving the class or getting removed from the class.
	 * @param classId ID of class user is leavin or getting removed from.
	 * @param leaving Whether the user is leaving or getting removed.
	 * @return HTTP response data in an Observable.
	 */
	public leaveClass(userId: string, classId: string, leaving: boolean): Observable<any> {
		return this.http.patch(`${environment.ENDPOINT}/class/leaveClass`, {
			userId: userId,
			classId: classId,
			leaving: leaving
		}, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}
}