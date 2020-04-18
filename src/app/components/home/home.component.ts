import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SocketIOService } from '../../services/socket-io.service';
import {FormBuilder, Validators} from "@angular/forms";
import {User} from "../../models/user";
import {Router} from "@angular/router";

@Component({
    selector: 'mean-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    userDetails: User;
    joinSessionForm = this.fb.group({
        sessionCode: ['', Validators.required]
    });

    constructor(
        private authenticationService: AuthenticationService,
        private socketService: SocketIOService,
        private fb: FormBuilder,
        private router: Router
    ) { }

    ngOnInit(): void { }

    logoutButton() {
        return this.authenticationService.logout();
    }

    createSession() {
        this.socketService.createSession();
        this.router.navigate(['session']);
    }

    joinSession() {
        this.userDetails = this.authenticationService.getUserDetails();
        const email = this.userDetails.email;
        this.socketService.joinSession(this.joinSessionForm.get('sessionCode').value, email);
    }
}
