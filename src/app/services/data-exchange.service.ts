import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// Service is used to deliver a message from a component to all other subscribed components. (Mainly used to get the session code across).
export class DataService {

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  // Method to change the message.
  changeMessage(message) {
    this.messageSource.next(message);
  }

}