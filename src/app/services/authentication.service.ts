/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * @packageDocumentation
 * @module Services
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Role } from '../models/role';
import { tokenData } from '../models/tokenData';
import { User } from '../models/user';

interface TokenResponse {
    token: string;
}

/**
 * This class sends all HTTP requests used for logging in, registering a user and contains all methods that deal
 * with the user's token/cokkie data.
 */
@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    private token: string;

    /**
     * AuthenticationSerivice constructor.
     * @param http
     * @param router
     * @param cookie
     */
    constructor(private http: HttpClient, private router: Router, private cookie: CookieService) { }

    /**
     * Method to save the JWT of the user in the browser's cookies.
     * @param token JWT to save in the user's browser cookies.
     * @return
     */
    private saveToken(token: string): void {
        this.cookie.set('jwt', token, 1, '/', 'localhost', false, 'Strict');
        this.token = token;
    }

    /**
     * Method to get the JWT from the browser's cookies for the current user.
     * @return
     */
    private getToken(): string {
        if (!this.token) {
            this.token = this.cookie.get('jwt');
        }
        return this.token;
    }

    /**
     * Method to logout the user.
     * @return
     */
    public logout(): void {
        this.token = '';
        this.cookie.delete('jwt');
        this.cookie.delete('io');
        this.router.navigateByUrl('/login');
    }

    /**
     * Method to extract all the important data from the user's JWT.
     * @return Data from JWT.
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

    /**
     * Method to check whether the user is currently logged in by looking at their cookie.
     * @return Whether the requesting user is logged in or not.
     */
    public isLoggedIn(): boolean {
        const tokenData = this.getTokenData();
        if (tokenData) {
            return tokenData.exp < Date.now() + (86400 * 1000);
        } else {
            return false;
        }
    }

    /**
     * Method to checks the role of the user.
     * @return User's role.
     */
    public getRole(): Role {
        return this.getTokenData().role;
    }


    /**
     * POST method for registering a user
     * @param user User that wants to register.
     * @return HTTP response data in an Observable.
     */
    public register(user: User): Observable<any> {
        return this.http.post(`${environment.ENDPOINT}/user/register`, user).pipe(
            map((data: TokenResponse) => {
                this.saveToken(data.token);
            })
        );
    }

    /**
     * POST method for logging in a user
     * @param user User that wants to login.
     * @return HTTP response data in an Observable.
     */
    public login(user: User): Observable<any> {
        return this.http.post(`${environment.ENDPOINT}/user/login`, user).pipe(
            map((data: TokenResponse) => {
                console.log(data.token);
                this.saveToken(data.token);
            })
        );
    }
}