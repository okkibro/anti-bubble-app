/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * shop.service.ts
 * This file sends all HTTP requests used for recovering and resetting a user's password.
 * @packageDocumentation
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Item } from '../models/item';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})

export class ShopService {

	/**
	 * ShopService constructor.
	 * @param http
	 * @param router
	 * @param cookie
	 */
	constructor(private http: HttpClient, private router: Router, private cookie: CookieService) { }

	/**
	 * Method to do a POST request to get an item from the shop of a specific type.
	 * @param type Category of items to be fetched from the database.
	 * @returns HTTP response data in an Observable.
	 */
	public getCategoryItems(type: string): Observable<any> {
		return this.http.get(`${environment.ENDPOINT}/shop`, { headers: { type: type, Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}

	/**
	 * Method to do a POST request to buy an item form the shop and update the users inventory in the database.
	 * @param item Item to be purchased by the user.
	 * @returns HTTP response data in an Observable.
	 */
	public buy(item: Item) {
		return this.http.post(`${environment.ENDPOINT}/shop/buy`, { item: item }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}

	/**
	 * Method to de a GET request to set the user's initial inventroy when he creates an account.
	 * @returns HTTP response data in an Observable.
	 */
	public getBaseInventory(): Observable<any> {
		return this.http.get(`${environment.ENDPOINT}/shop/getBaseInventory`, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}
}