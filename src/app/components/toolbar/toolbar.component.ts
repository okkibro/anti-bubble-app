import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from "../../models/user";
import { AuthenticationService } from "../../services/authentication.service";

@Component({
    selector: 'mean-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
    @Output() public sidenavToggle = new EventEmitter();

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

    public onToggleSidenav = () => {
        this.sidenavToggle.emit();
    }
}
