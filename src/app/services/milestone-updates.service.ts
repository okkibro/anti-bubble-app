/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * @packageDocumentation
 * @module Services
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Milestone } from '../models/milestone';

/**
 * This class sends all HTTP requests for determining whether a user can visit the labyrinth page, which he can
 * only when he hasn't done it yet.
 */
@Injectable({
    providedIn: 'root'
})

export class MilestoneUpdatesService {

    /**
     * MilestoneUpdatesService constructor.
     * @param http
     * @param cookie
     */
    constructor(private http: HttpClient, private cookie: CookieService) { }

    /**
     * Method to do a POST request to update a given milestone to a given value.
     * @param milestone Milestone to update.
     * @param value Value specified milestone has to be updated by.
     * @return HTTP response data in an Observable.
     */
    public updateMilestone(milestone: Milestone, value: number): Observable<any> {
        return this.http.post(`${environment.ENDPOINT}/user/updateMilestone`, { milestone: milestone, value: value }, { headers: { Authorization: 'Bearer ' + this.cookie.get('jwt') }});
    }

    /**
     * Method to do a POST request to update the recent milestone to the given value.
     * @param value Text to be added to user's scorebord on the home page.
     * @return HTTP response data in an Observable.
     */
    public updateScoreboard(value: string): Observable<any> {
        return this.http.post(`${environment.ENDPOINT}/user/updateScoreboard`, { value: value }, { headers: { Authorization: 'Bearer ' + this.cookie.get('jwt') }});
    }
}