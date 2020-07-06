/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BubbleGraphService {

    constructor(private http: HttpClient, private cookie: CookieService) { }

    /** Method to do a POST request to the backend to update the bubble statistics of a user */
    public updateBubble(answers: [{ question: any, answer: any }]) {
        return this.http.post(`${environment.ENDPOINT}/user/updateBubble`, { answers: answers }, { headers:  { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
    }

    public processLabyrinth(answers: [{ question: any, answer: any }]) {
        return this.http.post(`${environment.ENDPOINT}/user/processAnswers`, { answers: answers }, { headers:  { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
    }
}