import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import { SocketIOService } from 'src/app/services/socket-io.service';
import { DataService } from 'src/app/services/data-exchage.service';
import { User } from '../../models/user';

@Component({
    selector: 'mean-session',
    templateUrl: './session.component.html',
    styleUrls: ['./session.component.css',
    '../../shared/general-styles.css']
})

export class SessionComponent implements OnInit {
    userDetails: User;
    pin;
    
    constructor(
        private authenticationService: AuthenticationService, 
        private socketService: SocketIOService, 
        private data: DataService
    ) { }

    ngOnInit(): void {
        this.data.currentMessage.subscribe(message => {
            if (message) {
                this.pin = message;
                this.socketService.pin = message;
            }
        });

        this.authenticationService.profile().subscribe(user => {
            this.userDetails = user;
        });
    }

    logoutButton() {
        return this.authenticationService.logout();
    }
}
