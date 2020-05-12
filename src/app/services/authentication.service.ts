import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {User} from '../models/user';
import {Role} from '../models/role';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {CookieService} from 'ngx-cookie-service';

// TODO: Check for possible CSRF-attack vulnerabilities because of use of cookies
// TODO: Add function to get user from database in this service or another

interface TokenResponse {
    token: string;
}

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    private token: string;

    constructor(private http: HttpClient, private router: Router, private cookie: CookieService) {}

    /** Method that saves the JWT of the user in the browser's cookies */
    private saveToken(token: string): void {
        this.cookie.set('mean-token', token, 1, '/', 'localhost', false, 'Strict');
        this.token = token;
    }

    /** Method that gets the JWT from the browser's cookies for the current user */
    private getToken(): string {
        if (!this.token) {
            this.token = this.cookie.get('mean-token');
        }
        return this.token;
    }

    /** Method that logs the user out */
    public logout(): void {
        this.token = '';
        this.cookie.delete('mean-token');
        this.router.navigateByUrl('/login');
    }

    /** Method that extracts all the important data from the user's JWT */
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

    /** Method that checks whether the user is currently logged in */
    public isLoggedIn(): boolean {
        const user = this.getUserDetails();
        if (user) {
            return user.exp < Date.now() + (86400 * 1000);
        } else {
            return false;
        }
    }

    /** Method that checks whether the user is a teacher */
    public isTeacher(): boolean {
        const user = this.getUserDetails();
        if (user && this.isLoggedIn()) {
            return user.role === Role.teacher;
        } else {
            return false;
        }
    }

    /** Method that checks whether the user is a student */
    public isStudent(): boolean {
        const user = this.getUserDetails();
        if (user && this.isLoggedIn()) {
            return user.role === Role.student;
        } else {
            return false;
        }
    }

    /** Method that checks the role of the user*/
    public getRole(): Role {
        return this.getUserDetails().role;
    }

    // TODO: Add debouncing to reduce HTTP-requests for below 2 methods

    /** Method that POSTs to the backend API to check if a given email is already present in the database */
    public checkEmailTaken(email: string) {
        return this.http.post('https://localhost:3000/user/checkEmailTaken', { email: email });
    }

    /** Async validator method for checking if an email is already taken  */
    public uniqueEmailValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.checkEmailTaken(control.value).pipe(
                map(res => {
                    return res.hasOwnProperty('emailTaken') == true ? { emailTaken: true } : null;
                })
            );
        };
    }

    /** Method that updates the password of an already registered user */
    public updatePassword(email: string, oldPassword: string, newPassword: string) {
        return this.http.patch('https://localhost:3000/user/updatePassword', {email: email, oldPassword: oldPassword, newPassword: newPassword})
    }

    // TODO:: Check if this is necessary
    private request(method: 'post'|'get', type: 'login'|'register'|'profile'|'getAllClassmates'|any , user?: User): Observable<any> {
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

    /** POST method for registering a user */
    public register(user: User): Observable<any> {
        return this.request('post', 'register', user);
    }

    /** POST method for logging in a user */
    public login(user: User): Observable<any> {
        return this.request('post', 'login', user);
    }

    /** GET method for fetching a user's profile */
    public profile(): Observable<any> {
        return this.request('get', 'profile');
    }

    public getAllClassmates() : Observable<any> {
        return this.request('get', 'getAllClassmates');
    }

    public classmateProfile(id: string) : Observable<any> {
        return this.request('get', 'classmateProfile/' + id)
    }

}