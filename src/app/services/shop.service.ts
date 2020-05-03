import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ShopService {

  constructor(private http: HttpClient, private router: Router) { }

  public shop(type: 'alles'|'hoofddeksel'|'kleding'): Observable<any> {
    return this.http.get('https://localhost:3000/shop', {headers : { id : type }});
}

}
