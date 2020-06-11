import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class BubbleGraphService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  /** Method to do a POST request to the backend to update the 'bubble-graph' of the user. */ 
  public updateGraph(knowledge : Number, diversity : Number): Observable<any> {
    return this.http.post("https://localhost:3000/user/updateGraph", {knowledgeScore : knowledge, diversityScore : diversity}, {headers :  { Authorization: 'Bearer ' + this.cookie.get('mean-token')}});
  }
}
