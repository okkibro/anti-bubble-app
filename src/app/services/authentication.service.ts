/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Role } from '../models/role';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { tokenData } from '../models/tokenData';

interface TokenResponse {
    token: string;
}

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    private token: string;

    constructor(private http: HttpClient, private router: Router, private cookie: CookieService) { }

    /** Method to save the JWT of the user in the browser's cookies. */
    private saveToken(token: string): void {
        this.cookie.set('mean-token', token, 1, '/', 'localhost', false, 'Strict');
        this.token = token;
    }

    /** Method to get the JWT from the browser's cookies for the current user. */
    private getToken(): string {
        if (!this.token) {
            this.token = this.cookie.get('mean-token');
        }
        return this.token;
    }

    /** Method to logout the user. */
    public logout(): void {
        this.token = '';
        this.cookie.delete('mean-token');
        this.cookie.delete('io');
        this.router.navigateByUrl('/login');
    }

    /** Method to extract all the important data from the user's JWT. */
    public getTokenData(): tokenData {
        const token = this.getToken();
        let payload;
        if (token) {
            payload = token.split('.')[1];
            payload = window.atob(payload);
            return JSON.parse(payload);
        } else {
            return null;
        }
    }

    /** Method to check whether the user is currently logged in. */
    public isLoggedIn(): boolean {
        const user = this.getTokenData();
        if (user) {
            return user.exp < Date.now() + (86400 * 1000);
        } else {
            return false;
        }
    }

    /** Method to checks the role of the user. */
    public getRole(): Role {
        return this.getTokenData().role;
    }

    /** Method to POST to the backend API to check if a given email is already present in the database. */
    public checkEmailTaken(email: string) {
        return this.http.post('https://localhost:3000/user/checkEmailTaken', { email: email });
    }

    /** A async validator method to check if an email is already taken. */ 
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

    /** Method to update the password of an already registered user. */ 
    public updatePassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
        return this.http.patch('https://localhost:3000/user/updatePassword', { email: email, oldPassword: oldPassword, newPassword: newPassword })
    }

    /** POST method for registering a user */
    public register(user: User): Observable<any> {
        return this.http.post(`https://localhost:3000/user/register`, user).pipe(
            map((data: TokenResponse) => {
                this.saveToken(data.token);
            })
        );
    }

    /** POST method for logging in a user */
    public login(user: User): Observable<any> {
        return this.http.post(`https://localhost:3000/user/login`, user).pipe(
            map((data: TokenResponse) => {
                this.saveToken(data.token);
            })
        );
    }

    /** GET method for fetching a user's profile */
    public profile(): Observable<any> {
        return this.http.get(`https://localhost:3000/user/profile`, { headers: { Authorization: `Bearer ${this.getToken()}` } });
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */