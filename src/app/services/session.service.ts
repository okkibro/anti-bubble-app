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

export class SessionService {

    constructor(private http: HttpClient, private cookie: CookieService) { }

    /** Method to do a POST request to get the given activity. */
    public getActivity(activity: String): Observable<any> {
        return this.http.post(`${environment.ENDPOINT}/session/activity`, { activity: activity }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
    }

    /** Method to do a POST request to get a list of question in a randomized order. */
    public getArticles(): Observable<any> {
        return this.http.get(`${environment.ENDPOINT}/session/articles`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
    }

    /** Method to do a PATCH request to update the database of a user if they completed the initial labyrinth. */
    public performedLabyrinth(): Observable<any> {
        return this.http.patch(`${environment.ENDPOINT}/session/updateBubbleInit`, { }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
    }

    /** Method to do a POST request to get all the questions given a part. */
    public getShuffledQuestions(part: Number): Observable<any> {
        return this.http.post(`${environment.ENDPOINT}/session/questions`, { part: part }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
    }

    /** Method to do a POST request to save the given answers to the logged in user. */
    public saveAnswers(answers: any): Observable<any> {
        return this.http.post(`${environment.ENDPOINT}/session/labyrinthAnswers`, { answers: answers }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
    }

    /** Method to do a POST request to let the user earn money for the shop. */
    public earnMoney(money: Number): Observable<any> {
        return this.http.post(`${environment.ENDPOINT}/session/earnMoney`, { money: money }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
    }
}