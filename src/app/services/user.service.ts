/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient, private cookie: CookieService) { }

    /** DELETE method for deleting a user's account.*/
    public deleteAccount(): Observable<any> {
        return this.http.delete(`${environment.ENDPOINT}/user/deleteAccount`,  { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
    }

    /** Method to POST to the backend API to check if a given email is already present in the database. */
    public checkEmailTaken(email: string) {
        return this.http.post(`${environment.ENDPOINT}/user/checkEmailTaken`, { email: email });
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

    /** PATCH method to update the password of an already registered user. */
    public updatePassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
        return this.http.patch(`${environment.ENDPOINT}/user/updatePassword`, { email: email, oldPassword: oldPassword, newPassword: newPassword })
    }

    /** Method to do a PATCH request to change name/email/etc... of a user. */
    public updateUser(field: string, value: string): Observable<any>{
        return this.http.patch(`${environment.ENDPOINT}/user/updateUser`, { field: field, value: value }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
    }

    /** GET method for fetching a user's profile */
    public profile(): Observable<any> {
        return this.http.get(`${environment.ENDPOINT}/user/profile`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
    }
}