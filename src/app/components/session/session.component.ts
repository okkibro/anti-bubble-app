import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import { SocketIOService } from 'src/app/services/socket-io.service';
import { DataService } from 'src/app/services/data-exchage.service';
import { User } from '../../models/user';
import { ClassesService } from 'src/app/services/classes.service';

@Component({
    selector: 'mean-session',
    templateUrl: './session.component.html',
    styleUrls: ['./session.component.css',
    '../../shared/general-styles.css']
})

export class SessionComponent implements OnInit {
    userDetails: User;
    players = [];
    pin;
    
    constructor(
        private authenticationService: AuthenticationService, 
        private socketService: SocketIOService, 
        private data: DataService,
        private classesService: ClassesService
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
            if (user.role == "student") {
                this.socketService.getPlayers(emails => {
                    this.classesService.getSessionPlayers(emails).subscribe(players => {
                        this.players = players;
                    });
                });
            }
        });

    }

    logoutButton() {
        return this.authenticationService.logout();
    }
}
