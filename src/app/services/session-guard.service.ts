/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { SessionComponent } from '../components/session/session.component';
import { beforeUnload } from '../../../constants';

@Injectable({
    providedIn: 'root'
})

export class SessionGuardService implements CanDeactivate<SessionComponent> {

    constructor() { }

    /** Guard that activates when user tries to leave the session page. */
    canDeactivate(
        component: SessionComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot): boolean {

        // Let the host leave if they press home button at the end of the game.
        if (component.leaveByHomeButton) {
            return true;
        }

        // If player got kicked cause host disconnected or player is not in a session, then dont show the message and just leave the page.
        if (component.isHostDisconnected() || component.pin == undefined) {
            component.leaveSession();
            window.removeEventListener('beforeunload', beforeUnload);
            return true;
        } else {
            if (nextState.url != '/activities') {

                // Show confirmation before leaving.
                if (confirm('Weet je zeker dat je de sessie wilt verlaten?')) {

                    // If user answered confirm, leave the session.
                    component.leaveSession();
                    window.removeEventListener('beforeunload', beforeUnload);

                    // || currentState.url == '/labyrinth' --> delete if timer from labyrinth page will not be used
                    if (currentState.url == '/session') {
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

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
