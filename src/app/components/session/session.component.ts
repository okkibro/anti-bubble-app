import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";

@Component({
    selector: 'mean-session',
    templateUrl: './session.component.html',
    styleUrls: ['./session.component.css']
})

export class SessionComponent implements OnInit {

    constructor(private authenticationService: AuthenticationService) { }

    ngOnInit(): void { }

    logoutButton() {
        return this.authenticationService.logout();
    }
}
