/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'mean-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
    @Output() public sidenavClose = new EventEmitter();

    userDetails: User;

    constructor(private auth: AuthenticationService,) { }

    ngOnInit(): void {
        this.auth.profile().subscribe(user => {
            this.userDetails = user;
        })
    }

    /** Method to logout. */
    logoutButton() {
        return this.auth.logout();
    }

    public onSidenavClose = () => {
        this.sidenavClose.emit();
    }
}
