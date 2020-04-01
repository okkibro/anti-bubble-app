import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from '../models/user';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";

interface TokenResponse {
    token: string;
}

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    private token: string;

    constructor(private http: HttpClient, private router: Router) {}

    private saveToken(token: string): void {
        localStorage.setItem('mean-token', token);
        this.token = token;
    }

    private getToken(): string {
        if (!this.token) {
            this.token = localStorage.getItem('mean-token');
        }
        return this.token;
    }

    public logout(): void {
        this.token = '';
        window.localStorage.removeItem('mean-token');
        this.router.navigateByUrl('/');
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

    public checkEmailTaken(email: string) {
        console.log(JSON.stringify({ email: email }));
        return this.http.post('https://localhost:3000/user/checkEmailTaken', JSON.stringify({ email: email }));
    }

    public uniqueEmailValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.checkEmailTaken(control.value).pipe(
                map(res => {
                    console.log(res);
                    // if res is true, username exists, return true
                    return res ? { usernameExists: true } : null;
                    // NB: Return null if there is no error
                })
            );
        };
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