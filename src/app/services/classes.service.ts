import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  public joinClass(code: String) : Observable<any> {
    return this.http.post('https://localhost:3000/user/joinClass', { code: code }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token')}});
  }
}
