/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * bubble-graph.service.ts
 * This file sends all HTTP requests used for processing the user's introduction labyrinth.
 * @packageDocumentation
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Question } from '../models/question';

@Injectable({
	providedIn: 'root'
})

export class BubbleGraphService {

	/**
	 * BubbleGrappService constructor.
	 * @param http
	 * @param cookie
	 */
	constructor(private http: HttpClient, private cookie: CookieService) { }

	/**
	 * Method to do a POST request to the backend to process the answers given during the introduction labyrinth
	 * and generate the user's initial bubble.
	 * @param answers Questions and their answers given duriong the introduction labyrinth.
	 * @returns HTTP response data in an Observable.
	 */
	public processLabyrinth(answers: [{ question: Question, answer: number }]): Observable<any> {
		return this.http.post(`${environment.ENDPOINT}/user/processAnswers`, { answers: answers }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}
}