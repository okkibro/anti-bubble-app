import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from '../models/user';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { CookieService } from 'ngx-cookie-service';

// TODO: Check for possible CSRF-attack vulnerabilities because of use of cookies

interface TokenResponse {
    token: string;
}

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    private token: string;

    constructor(private http: HttpClient, private router: Router, private cookie: CookieService) {}

    private saveToken(token: string): void {
        this.cookie.set('mean-token', token, 1, '/', 'localhost', false, 'Strict');
        this.token = token;
    }

    private getToken(): string {
        if (!this.token) {
            this.token = this.cookie.get('mean-token');
        }
        return this.token;
    }

    public logout(): void {
        this.token = '';
        this.cookie.delete('mean-token');
        this.router.navigateByUrl('/login');
    }

    public getUserDetails(): User {
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

    public isLoggedIn(): boolean {
        const user = this.getUserDetails();
        if (user) {
            return user.exp < Date.now() + (86400 * 1000);
        } else {
            return false;
        }
    }

    // TODO: Add debouncing to reduce HTTP-requests for below 2 methods

    public checkEmailTaken(email: string) {
        return this.http.post('https://localhost:3000/user/checkEmailTaken', { email: email });
    }

    public uniqueEmailValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.checkEmailTaken(control.value).pipe(
                map(res => {
                    return res.hasOwnProperty('emailTaken') == true ? { emailTaken: true } : null;
                })
            );
        };
    }

    public updatePassword(email: string, oldPassword: string, newPassword: string) {
        return this.http.patch('https://localhost:3000/user/updatePassword', {email: email, oldPassword: oldPassword, newPassword: newPassword})
    }

    private request(method: 'post'|'get', type: 'login'|'register'|'profile', user?: User): Observable<any> {
        let base;

        if (method === 'post') {
            base = this.http.post(`https://localhost:3000/user/${type}`, user);
        } else {
            base = this.http.get(`https://localhost:3000/user/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
        }

        return base.pipe(
            map((data: TokenResponse) => {
                if (data.token) {
                    this.saveToken(data.token);
                }
                return data;
            })
        );
    }

    public register(user: User): Observable<any> {
        return this.request('post', 'register', user);
    }

    public login(user: User): Observable<any> {
        return this.request('post', 'login', user);
    }

    public profile(): Observable<any> {
        return this.request('get', 'profile');
    }
}