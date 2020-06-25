/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class AvatarService {

    constructor(private http: HttpClient, private cookie: CookieService) { }

    /** Method to do a POST request to the backend to equip and item on the avatar of the user. */
    equip(item): Observable<any>{
        return this.http.post('https://localhost:3000/user/avatar', { avatarItem: item }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */