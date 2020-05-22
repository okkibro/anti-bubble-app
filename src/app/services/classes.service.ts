import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Class } from '../models/classes';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  public createClass(classes: Class, teacher: User){
    return this.http.post('https://localhost:3000/user/createClass', {classes: classes, teacher: teacher}, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token')}})
  }

  public joinClass(code: Number) : Observable<any> {
    return this.http.post('https://localhost:3000/user/joinClass', { code: code }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token')}});
  }

  public getClass() : Observable<any> {
    return this.http.get('https://localhost:3000/user/getClass', { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token')}});
  }
}
