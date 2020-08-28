/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * This file sends all HTTP requests used for recovering and resetting a user's password.
 * @packageDocumentation
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})

export class UserService {

	/**
	 * UserService constructor.
	 * @param http
	 * @param cookie
	 */
	constructor(private http: HttpClient, private cookie: CookieService) { }

	/**
	 * Method to do a DELETE request for deleting a user's account.
	 * @return HTTP response data in an Observable.
	 */
	public deleteAccount(): Observable<any> {
		return this.http.delete(`${environment.ENDPOINT}/user/deleteAccount`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}

	/**
	 * Method to do a POST request to check if a given email is already present in the database.
	 * @param email Email to be checked.
	 * @return HTTP response data in an Observable.
	 */
	public checkEmailTaken(email: string) {
		return this.http.post(`${environment.ENDPOINT}/user/checkEmailTaken`, { email: email });
	}

	/**
	 * An async validator method to check if an email is already taken.
	 * @return Validator function for verifying email uniqueness.
	 */
	public uniqueEmailValidator(): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			return this.checkEmailTaken(control.value).pipe(
				map(res => {
					if (res['emailTaken'] == false) {
						return null;
					} else {
						return { emailTaken: true };
					}
				})
			);
		};
	}

	/**
	 * Method to do a PATCH request to update the password of an already registered user.
	 * @param oldPassword Old password for verification.
	 * @param newPassword New password for user.
	 * @return HTTP response data in an Observable.
	 */
	public updatePassword(oldPassword: string, newPassword: string): Observable<any> {
		return this.http.patch(`${environment.ENDPOINT}/user/updatePassword`,
			{ oldPassword: oldPassword, newPassword: newPassword },
			{ headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}

	/**
	 * Method to do a PATCH request to change name/email/etc... of a user.
	 * @param field User profile field to be updated.
	 * @param value New value of specified field.
	 * @return HTTP response data in an Observable.
	 */
	public updateUser(field: string, value: string): Observable<any> {
		return this.http.patch(`${environment.ENDPOINT}/user/updateUser`, {
			field: field,
			value: value
		}, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}

	/**
	 * Method to do a GEt request for fetching a user's profile
	 * @return HTTP response data in an Observable.
	 */
	public profile(): Observable<any> {
		return this.http.get(`${environment.ENDPOINT}/user/profile`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}
}