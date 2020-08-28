/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * authentication.service.ts
 * This file sends all HTTP requests used for recovering and resetting a user's password.
 * @packageDocumentation
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})

export class PasswordRecoveryService {

    /**
     * PasswordRecoveryService constructor.
     * @param http
     */
    constructor(private http: HttpClient) { }

    /**
     * Method to do a POST request to send an email to reset your password.
     * @param email Email of visitor who wants to recover his password.
     * @return HTTP response data in an Observable.
     */
    public sendEmail(email: string): Observable<any> {
        return this.http.post<any>(`${environment.ENDPOINT}/user/passwordrecovery`, { email: email });
    }

    /**
     * Method to do a GET request to load the restPage.
     * @param token Recovery token.
     * @return HTTP response data in an Observable.
     */
    public getResetPage(token: string): Observable<any> {
        return this.http.get<any>(`${environment.ENDPOINT}/user/reset/${token}`);
    }

    /**
     * Method to do a POST request to reset the password of user to the new password.
     * @param token Recovery token.
     * @param newPassword New password.
     * @return HTTP response data in an Observable.
     */
    public postNewPassword(token: string, newPassword: string): Observable<any> {
        return this.http.post<any>(`${environment.ENDPOINT}/user/reset/${token}`, { newPassword: newPassword });
    }
}