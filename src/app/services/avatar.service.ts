/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * avatar.service.ts
 * This file sends all HTTP requests needed by the avatar page, which is just the equiping of items by
 * changing them in the database.
 * @packageDocumentation
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { ShopItem } from '../models/shopItem';

@Injectable({
	providedIn: 'root'
})

export class AvatarService {

	/**
	 * AvatarService constructor.
	 * @param http
	 * @param cookie
	 */
	constructor(private http: HttpClient, private cookie: CookieService) { }

	/** Method to do a POST request to the backend to equip and item on the avatar of the user.
	 * @param item Item to equip.
	 * @returns HTTP response data in an Observable.
	 */
	equip(item: ShopItem): Observable<any> {
		return this.http.post(`${environment.ENDPOINT}/user/avatar`, { avatarItem: item }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
	}
}