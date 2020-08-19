/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * authentication.service.ts
 * This file sends all HTTP requests used for logging in, registering a user and contains all methods that deal
 * with the user's token/cokkie data.
 * @packageDocumentation
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Role } from '../models/role';
import { CookieService } from 'ngx-cookie-service';
import { tokenData } from '../models/tokenData';
import { environment } from 'src/environments/environment';

interface TokenResponse {
    token: string;
}

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    private token: string;

    constructor(private http: HttpClient, private router: Router, private cookie: CookieService) { }

    /** Method to save the JWT of the user in the browser's cookies.
     * @param token JWT to save in the user's browser cookies.
     * @returns
     */
    private saveToken(token: string): void {
        this.cookie.set('mean-token', token, 1, '/', 'localhost', false, 'Strict');
        this.token = token;
    }

    /**
     * Method to get the JWT from the browser's cookies for the current user.
     * @returns
     */
    private getToken(): string {
        if (!this.token) {
            this.token = this.cookie.get('mean-token');
        }
        return this.token;
    }

    /**
     * Method to logout the user.
     * @returns
     */
    public logout(): void {
        this.token = '';
        this.cookie.delete('mean-token');
        this.cookie.delete('io');
        this.router.navigateByUrl('/login');
    }

    /** Method to extract all the important data from the user's JWT.
     * @returns Data from JWT.
     */
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

    /** Method to check whether the user is currently logged in by looking at their cookie.
     * @returns Whether the requesting user is logged in or not.
     */
    public isLoggedIn(): boolean {
        const user = this.getTokenData();
        if (user) {
            return user.exp < Date.now() + (86400 * 1000);
        } else {
            return false;
        }
    }

    /** Method to checks the role of the user.
     * @returns User's role.
     */
    public getRole(): Role {
        return this.getTokenData().role;
    }


    /** POST method for registering a user
     * @param user User that wants to register.
     * @returns HTTP response data in an Observable.
     */
    public register(user: User): Observable<any> {
        return this.http.post(`${environment.ENDPOINT}/user/register`, user).pipe(
            map((data: TokenResponse) => {
                this.saveToken(data.token);
            })
        );
    }

    /** POST method for logging in a user
     * @param user User that wants to login.
     * @returns HTTP response data in an Observable.
     */
    public login(user: User): Observable<any> {
        return this.http.post(`${environment.ENDPOINT}/user/login`, user).pipe(
            map((data: TokenResponse) => {
                this.saveToken(data.token);
            })
        );
    }
}