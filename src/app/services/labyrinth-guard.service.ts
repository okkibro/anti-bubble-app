/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * @packageDocumentation
 * @module Services
 */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

/**
 * This class contains the guard for determining whether a user can visit the labyrinth page, which he can
 * only when he hasn't done it yet.
 */
@Injectable({
    providedIn: 'root'
})

export class LabyrinthGuardService implements CanActivate {

    /**
     * LabyrinthGuardService constructor.
     * @param userService
     * @param router
     */
    constructor(private userService: UserService, private router: Router) { }

    /**
     * Guard that makes sure the user can't direct back to labyrinth after it is already completed.
     * @return Whether user can visit the labyrinth page.
     */
    public canActivate(): boolean {
        this.userService.profile().subscribe((user) => {
            if (user.bubbleInit) {
                this.router.navigateByUrl('/home');
            }
        })
        return true;
    }
}
