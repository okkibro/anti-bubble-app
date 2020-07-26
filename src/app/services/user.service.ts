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

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient, private cookie: CookieService) { }

    /** Method to do a PATCH request to change name/email/etc... of a user. */
    updateUser(field: string, value: string): Observable<any>{
        return this.http.patch(`${environment.ENDPOINT}/user/updateUser`, { field: field, value: value }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
    }
}