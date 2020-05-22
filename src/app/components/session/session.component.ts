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
    players = [];
    pin;
    
    constructor(
        private authenticationService: AuthenticationService, 
        private socketService: SocketIOService, 
        private data: DataService,
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

            if (this.userDetails.role == "teacher") {
                this.socketService.listenForUpdates(newPlayer => {
                    this.players.push(newPlayer);
                    console.log("new player joined");
                    let tableRow = document.createElement("tr").appendChild(document.createTextNode(newPlayer.firstName));
                    let breakLine = document.createElement("br");
                    let table = document.getElementsByClassName("sessionTable")[0];
                    table.appendChild(tableRow);
                    table.appendChild(breakLine);
                });
            }
        });
    }

    logoutButton() {
        return this.authenticationService.logout();
    }

    getPlayers() {
        if (this.userDetails.role == "teacher") {
            this.socketService.getPlayers(players => {
                this.players = players;
            });
        }
    }
}
