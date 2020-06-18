import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class LabyrinthGuardService implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) { }

  // Guard that makes sure the user can't direct back to labyrinth after it is already completed
  canActivate(currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot): boolean {
    this.auth.profile().subscribe((user) => {
      if (user.bubbleInit) {
        this.router.navigateByUrl('/home');
      }
    })
    return true;
  }
}
