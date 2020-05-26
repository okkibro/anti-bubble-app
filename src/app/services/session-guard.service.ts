import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { SessionComponent } from '../components/session/session.component';

@Injectable({
  providedIn: 'root'
})
export class SessionGuardService implements CanDeactivate<SessionComponent> {

  constructor() { }

  canDeactivate(component: SessionComponent): boolean {
    if (component.isHostDisconnected()) {
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
