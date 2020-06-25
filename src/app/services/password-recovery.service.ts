/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class PasswordRecoveryService {
    constructor(private http: HttpClient) { }

    /** Method to do a POST request to send an email to reset your password. */
    public sendEmail(email: string): Observable<any> {
        return this.http.post<any>('https://localhost:3000/user/passwordrecovery', {
            email: email,
        });
    }

    /** Method to do a GET request to load the restPage. */
    public getResetPage(token: string): Observable<any> {
        return this.http.get<any>(`https://localhost:3000/user/reset/${token}`);
    }

    /** Method to do a POST request to reset the password of user to the new password. */
    public postNewPassword(token: string, password: string, repeatPassword: string): Observable<any> {
        return this.http.post<any>(`https://localhost:3000/user/reset/${token}`, {
            password: password,
            repeatPassword: repeatPassword,
        });
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */