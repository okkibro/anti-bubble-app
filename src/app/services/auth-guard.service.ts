/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * auth-guard.service.ts
 * This file contains the guard for checking whether a visitor can access the requested page by looking if
 * they are logged in and their role if the page requires it. Required role for a certain page are defined in
 * app-routing module.
 * @packageDocumentation
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
	providedIn: 'root'
})

export class AuthGuardService implements CanActivate {

	/**
	 * AuthGuardService constructor.
	 * @param auth
	 * @param router
	 */
	constructor(private auth: AuthenticationService, private router: Router) {
	}

	/** Method to check whether the user can access a certain page.
	 * @param route
	 * @return Whether the visitor can access the requested page.
	 */
	canActivate(route: ActivatedRouteSnapshot): boolean {

		// Check if user is logged in.
		if (this.auth.isLoggedIn()) {

			// Check if there are any necessary roles defined in the app-routing module and whether the user has them.
			if (route.data.roles && route.data.roles.indexOf(this.auth.getRole()) === -1) {
				this.router.navigateByUrl('/home');
				return false;
			}
			return true;
		}

		// Always redirect to login page when user is not logged in.
		this.router.navigateByUrl('/login');
		return true;
	}
}