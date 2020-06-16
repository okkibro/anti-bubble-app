import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from "../../models/user";
import { AuthenticationService } from "../../services/authentication.service";

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
