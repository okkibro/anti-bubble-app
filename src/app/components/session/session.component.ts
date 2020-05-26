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
                    let tableRow = document.createElement("tr");
                    tableRow.appendChild(document.createTextNode(newPlayer.firstName + " " + newPlayer.lastName));
                    tableRow.classList.add("player");
                    let breakLine = document.createElement("br");
                    let table = document.getElementsByClassName("sessionTable")[0];
                    table.appendChild(tableRow);
                }, removedPlayer => {
                    // remove player from the list
                    this.players = this.players.filter(x => x.email != removedPlayer.email);

                    // remove player from DOM
                    let htmlPlayers = document.getElementsByClassName("player"); // get all tr's with class player
                    for (let i = 0; i < htmlPlayers.length; i++) {
                        if (htmlPlayers[i].childNodes[0].textContent == removedPlayer.name) { // if the name is equal to removed player
                            htmlPlayers[i].remove(); // remove the node
                        }
                    }
                });
            }
        });
    }

    logoutButton() {
        return this.authenticationService.logout();
    }

    leaveSession() {
        this.socketService.leaveSession();
    }

    isHostDisconnected(): boolean {
        return this.socketService.hostDisconnected;
    }

    // getPlayers() {
    //     if (this.userDetails.role == "teacher") {
    //         this.socketService.getPlayers(players => {
    //             this.players = players;
    //         });
    //     }
    // }
}
