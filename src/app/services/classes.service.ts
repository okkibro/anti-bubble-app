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

  public getClassIds(): Observable<any> {
    return this.http.get('https://localhost:3000/class/getClassIds', { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
  }

  public getSingleClass(id: string): Observable<any> {
    return this.http.get(`https://localhost:3000/class/getSingleClass/${id}`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
  }

  public classmateProfile(id: string): Observable<any> {
    return this.http.get(`https://localhost:3000/class/classmateProfile/${id}`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } })
  }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */