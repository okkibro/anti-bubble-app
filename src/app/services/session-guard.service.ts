import { Injectable } from '@angular/core';
import { CanDeactivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { SessionComponent } from '../components/session/session.component';

@Injectable({
  providedIn: 'root'
})

export class SessionGuardService implements CanDeactivate<SessionComponent> {

  constructor() { }

  // Guard that activates when user tries to leave the session page
  canDeactivate(component: SessionComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {
    // If player got kicked cause host disconnected or player is not in a session, then dont show the message and just leave the page
    if (component.isHostDisconnected() || component.pin == undefined) {
      component.leaveSession();
      window.removeEventListener('beforeunload', component.beforeUnload);
      return true;
    } else {
      if (nextState.url != '/activities') {
        if (confirm("Weet je zeker dat je de sessie wilt verlaten?")) {
          component.leaveSession();
          window.removeEventListener('beforeunload', component.beforeUnload);
          return true;
        } else {
          return false;
        }
      } else { 
        return true; 
      }
    }
  }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
