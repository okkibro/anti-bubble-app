import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  public getActivity(activity: String) : Observable<any> {
    return this.http.post('https://localhost:3000/session/activity', { activity: activity }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token')}});
  }

  public performedLabyrinth(email : String) : Observable<any> {
      return this.http.patch('https://localhost:3000/session/updateBubbleInit', { email: email });
  }
}
