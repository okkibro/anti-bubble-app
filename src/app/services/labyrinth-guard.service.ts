import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { LabyrinthComponent } from '../components/labyrinth/labyrinth.component';
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
