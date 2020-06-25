/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Class } from '../models/classes';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class ClassesService {

    constructor(private http: HttpClient, private cookie: CookieService) { }

    /** Method to do a POST request to create a new class in the database. */
    public createClass(classes: Class, teacher: User) {
        return this.http.post('https://localhost:3000/class/createClass', { classes: classes, teacher: teacher }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } })
    }

    /** Method to do a POST request to join an existing class based on the given code. */
    public joinClass(code: Number): Observable<any> {
        return this.http.post('https://localhost:3000/class/joinClass', { code: code }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
    }

    /** Method to do a GET request to get the class the user is in. In case of a teacher this returns the first class in the class list of teacher. */
    public getClass(): Observable<any> {
        return this.http.get('https://localhost:3000/class/getClass', { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
    }

    /** Method to do a GET request to get all the class ids in the class list of a user (Only user for teachers). */
    public getClassIds(): Observable<any> {
        return this.http.get('https://localhost:3000/class/getClassIds', { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
    }

    /** Method to do a GET request to get a single class based on the id (Used to load all classes in the class list of a teacher). */
    public getSingleClass(id: string): Observable<any> {
        return this.http.get(`https://localhost:3000/class/getSingleClass/${id}`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
    }

    /** Method to do a GET request to get the profile of a classmate. */
    public classmateProfile(id: string): Observable<any> {
        return this.http.get(`https://localhost:3000/class/classmateProfile/${id}`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }})
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */