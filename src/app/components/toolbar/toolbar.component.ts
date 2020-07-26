/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { tokenData } from 'src/app/models/tokenData';

@Component({
    selector: 'mean-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css']
})

export class ToolbarComponent implements OnInit {
    @Output() public sidenavToggle = new EventEmitter();

    tokenData: tokenData;

    constructor(private auth: AuthenticationService) { }

    ngOnInit(): void {
        this.tokenData = this.auth.getTokenData();
    }

    /** Method to logout. */
    logoutButton() {
        return this.auth.logout();
    }

    public onToggleSidenav = () => {
        this.sidenavToggle.emit();
    }
}
