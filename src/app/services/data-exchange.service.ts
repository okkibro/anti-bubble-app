/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * @packageDocumentation
 * @module Services
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * This class contains all the code for exchanging a message from a component to all other subscribed components,
 * which is mainly used to get the session code across.
 */
@Injectable({
	providedIn: 'root'
})

export class DataService {
	private messageSource = new BehaviorSubject('');
	public currentMessage = this.messageSource.asObservable();

	constructor() { }

	/**
	 * Method to change the message.
	 * @param message Data to be transferred between components.
	 * @return
	 */
	public changeMessage(message: string): void {
		this.messageSource.next(message);
	}
}