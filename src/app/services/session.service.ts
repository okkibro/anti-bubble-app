import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  /** Function that sends an HTTP post request that gets an activity based on the given string. */
  public getActivity(activity: String): Observable<any> {
    return this.http.post('https://localhost:3000/session/activity', { activity: activity }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
  }

    /** Function  */
    public getArticles(): Observable<any> {
      return this.http.get('https://localhost:3000/session/articles', { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
    }

  /** Function that sends an HTTP patch request that sets the bubbleInit of the logged in user to true. */
  public performedLabyrinth(): Observable<any> {
    return this.http.patch('https://localhost:3000/session/updateBubbleInit', {}, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
  }

  /** Function that sends an HTTP post request that gets all the questions given a part. */
  public getShuffledQuestions(part: Number): Observable<any> {
    return this.http.post('https://localhost:3000/session/questions', { part: part }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
  }

  /** Function that sends an HTTP post request that saves the given answers to the logged in user. */
  public saveAnswers(answers: any): Observable<any> {
    return this.http.post('https://localhost:3000/session/labyrinthAnswers', { answers: answers }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
  }
}
