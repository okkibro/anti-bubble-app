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

  public createClass(classes: Class, teacher: User) {
    return this.http.post('https://localhost:3000/class/createClass', { classes: classes, teacher: teacher }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } })
  }

  public joinClass(code: Number): Observable<any> {
    return this.http.post('https://localhost:3000/class/joinClass', { code: code }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
  }

  public getClass(): Observable<any> {
    return this.http.get('https://localhost:3000/class/getClass', { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
  }

  public getAllClassmates(): Observable<any> {
    return this.http.get('https://localhost:3000/class/getAllClassmates', { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }})
  }

  public classmateProfile(id: string): Observable<any> {
    return this.http.get(`https://localhost:3000/class/classmateProfile/${id}`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }})
  }
}
