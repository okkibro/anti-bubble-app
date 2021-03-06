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
import { Log } from '../models/log';

/**
 * This class sends all HTTP requests used for recording/p-laying/finishing sessions, saving answers and
 * getting/saving questions/ansers from the initial labyrinth.
 */
@Injectable({
	providedIn: 'root'
})

export class SessionService {

	/**
	 * SessionService constructor.
	 * @param http
	 * @param cookie
	 */
	constructor(private http: HttpClient, private cookie: CookieService) { }

	/**
	 * Method to do a POST request to get the given activity.
	 * @param activity Activity to be fetched.
	 * @return HTTP response data in an Observable.
	 */
	public getActivity(activity: string): Observable<any> {
		return this.http.post(`${environment.ENDPOINT}/session/activity`, { activity: activity }, { headers: { Authorization: 'Bearer ' + this.cookie.get('jwt') }});
	}

	/**
	 * Method to do a POST request to get a list of question in a randomized order.
	 * @return HTTP response data in an Observable.
	 */
	public getArticles(): Observable<any> {
		return this.http.get(`${environment.ENDPOINT}/session/articles`, { headers: { Authorization: 'Bearer ' + this.cookie.get('jwt') }});
	}

	/**
	 * Method to do a PATCH request to update the database of a user if they completed the initial labyrinth.
	 * @return HTTP response data in an Observable.
	 */
	public performedLabyrinth(): Observable<any> {
		return this.http.patch(`${environment.ENDPOINT}/session/updateBubbleInit`, {}, { headers: { Authorization: 'Bearer ' + this.cookie.get('jwt') }});
	}

	/**
	 * Method to do a POST request to get all the questions given a part.
	 * @param part Part of the labyrinth which questions need to get.
	 * @return HTTP response data in an Observable.
	 */
	public getQuestions(part: number): Observable<any> {
		return this.http.post(`${environment.ENDPOINT}/session/questions`, { part: part }, { headers: { Authorization: 'Bearer ' + this.cookie.get('jwt') }});
	}

	/**
	 * Method to do a POST request to save the given answers to the logged in user.
	 * @param answers Answers given by user.
	 * @return HTTP response data in an Observable.
	 */
	public saveAnswers(answers: any): Observable<any> {
		return this.http.post(`${environment.ENDPOINT}/session/labyrinthAnswers`, { answers: answers }, { headers: { Authorization: 'Bearer ' + this.cookie.get('jwt') }});
	}

	/**
	 * Method to do a POST request to let the user earn money for the shop.
	 * @param money Amount of money to be earned.
	 * @return HTTP response data in an Observable.
	 */
	public earnMoney(money: number): Observable<any> {
		return this.http.post(`${environment.ENDPOINT}/session/earnMoney`, { money: money }, { headers: { Authorization: 'Bearer ' + this.cookie.get('jwt') }});
	}

	/**
	 * Method to do a POST request to record data about a session that has ended.
	 * @param sessionData All relevant session data.
	 * @return HTTP response data in an Observable.
	 */
	public recordSession(sessionData: Log): Observable<any> {
		return this.http.post(`${environment.ENDPOINT}/session/recordSession`, { sessionData: sessionData }, { headers: { Authorization: 'Bearer ' + this.cookie.get('jwt') }});
	}
}