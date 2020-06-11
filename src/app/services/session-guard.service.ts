import { Injectable } from '@angular/core';
import { CanDeactivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { SessionComponent } from '../components/session/session.component';

@Injectable({
  providedIn: 'root'
})

export class SessionGuardService implements CanDeactivate<SessionComponent> {

  constructor() { }

  // Guard that activates when user tries to leave the session page.
  canDeactivate(component: SessionComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {
    
    // If player got kicked cause host disconnected or player is not in a session, then dont show the message and just leave the page.
    if (component.isHostDisconnected() || component.pin == undefined) {
      component.leaveSession();
      window.removeEventListener('beforeunload', component.beforeUnload);
      return true;
    } else {
      if (nextState.url != '/activities') {
        if (confirm("Weet je zeker dat je de sessie wilt verlaten?")) { // Show confirmation before leaving.

          // If user answered confirm, leave the session.
          component.leaveSession();
          window.removeEventListener('beforeunload', component.beforeUnload);
          if (currentState.url == '/session' ) { // || currentState.url == '/labyrinth' --> delete if timer from labyrinth page will not be used
            clearInterval(component.interval);
          }
          return true;
        } else {

          // If user answered cancel, return false.
          return false;
        }
      } else { 

        // If the user goes to /activity that means the game started in the session so return true.
        return true; 
      }
    }
  }
}
