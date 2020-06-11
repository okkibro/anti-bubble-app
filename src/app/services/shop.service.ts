import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { ShopItem } from '../models/shopItem';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class ShopService {

  constructor(private http: HttpClient, private router: Router, private cookie: CookieService) { }

  public shop(type: 'haar'|'lichaam'|'broek'|'shirt'|'schoenen'|'bril'|'hoofddeksel'|'medaille'): Observable<any> {
    return this.http.get('https://localhost:3000/shop', {headers : { id : type }});
  }

  public buy(item : ShopItem) {
    return this.http.post('https://localhost:3000/shop/buy', { item: item }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token')}});
  }

}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */