import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private auth: AuthenticationService, private router: Router) {}

    /** Method that checks whether the user can access a certain page */
    canActivate(route: ActivatedRouteSnapshot) {

        // Check if user is logged in
        if (this.auth.isLoggedIn()) {

            // Check if there are any necessary roles defined in the app-routing module and whether the user has them
            if (route.data.roles && route.data.roles.indexOf(this.auth.getRole()) === -1) {
                this.router.navigateByUrl('/home');
                return false;
            }
            return true
        }

        // Always redirect to login page when user is not logged in
        this.router.navigateByUrl('/login');
        return true;
    }
}