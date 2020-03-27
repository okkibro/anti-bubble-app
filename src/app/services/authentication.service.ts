import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from '../models/user';

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

    // TODO: Check user.exp > 86400 statement
    public isLoggedIn(): boolean {
        const user = this.getUserDetails();
        if (user) {
            return user.exp > 86400;
        } else {
            return false;
        }
    }

    private request(method: 'post'|'get', type: 'login'|'register'|'profile', user?: User): Observable<any> {
        let base;

        console.log("Here 3");

        if (method === 'post') {
            base = this.http.post(`https://localhost:3000/user/${type}`, user);
        } else {
            base = this.http.get(`https://localhost:3000/user/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
        }

        console.log("Here 7");

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
        console.log("Here 2");
        return this.request('post', 'login', user);
    }

    public profile(): Observable<any> {
        console.log("Here 10");
        return this.request('get', 'profile');
    }
}