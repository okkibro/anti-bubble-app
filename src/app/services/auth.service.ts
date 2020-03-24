import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
  endpoint: string = 'https://localhost:3000';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

    constructor(
        private http: HttpClient,
        public router: Router
    ) {
    }

    // Sign-up
    register(user: User): Observable<any> {
        let api = `${this.endpoint}/register`;
        return this.http.post(api, user)
            .pipe(
                catchError(this.handleError)
            )
    }

    // Sign-in
    login(user: User) {
        return this.http.post<any>(`${this.endpoint}/login`, user)
            .subscribe((res: any) => {
                localStorage.setItem('access_token', res.token);
                this.getUserProfile(res._id).subscribe((res) => {
                    this.currentUser = res;
                    this.router.navigate(['user-profile/' + res.msg._id]);
                })
            })
    }

    getToken() {
        return localStorage.getItem('access_token');
    }

    get isLoggedIn(): boolean {
        let authToken = localStorage.getItem('access_token');
        return (authToken !== null);
    }

    doLogout() {
        let removeToken = localStorage.removeItem('access_token');
        if (removeToken == null) {
            this.router.navigate(['login']);
        }
    }

    // User profile
    getUserProfile(id): Observable<any> {
        let api = `${this.endpoint}/user-profile/${id}`;
        return this.http.get(api, { headers: this.headers }).pipe(
            map((res: Response) => {
                return res || {}
            }),
            catchError(this.handleError)
        )
    }

    // Error
    handleError(error: HttpErrorResponse) {
        let msg: string;
        if (error.error instanceof ErrorEvent) {
            // client-side error
            msg = error.error.message;
        } else {
            // server-side error
            msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(msg);
    }
}