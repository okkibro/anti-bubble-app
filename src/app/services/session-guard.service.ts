import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { SessionComponent } from '../components/session/session.component';

@Injectable({
  providedIn: 'root'
})
export class SessionGuardService implements CanDeactivate<SessionComponent> {

  constructor() { }

  // Guard that activates when user tries to leave the session page
  canDeactivate(component: SessionComponent): boolean {
    // If player got kicked cause host disconnected or player is not in a session, then dont show the message and just leave the page
    if (component.isHostDisconnected() || component.pin == undefined) {
      component.leaveSession();      
      return true;
    } else {
      if (confirm("Weet je zeker dat je de sessie wilt verlaten?")) {
        component.leaveSession();
        return true;
      } else {
        return false;
      }
    }
  }
}
