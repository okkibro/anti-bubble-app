import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { SocketIOService } from 'src/app/services/socket-io.service';
import { DataService } from 'src/app/services/data-exchange.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

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
    gameData;
    playerCount = 0;
    activity;
    gameStarted;
    interval;

    constructor(
        private auth: AuthenticationService,
        private socketService: SocketIOService,
        private data: DataService,
        private router: Router,
        private sessionService: SessionService,
    ) { }

    ngOnInit(): void {
        this.gameStarted = false;
        this.gameData = this.getGameData();

        // Get pin of the session from the dataservice
        this.data.currentMessage.subscribe(message => {
            if (message) {
                this.pin = message;
                this.socketService.pin = message;
            }
        });

        this.auth.profile().subscribe(user => {
            this.userDetails = user;

            if (this.userDetails.role == "teacher") {
                this.socketService.listenForUpdates(newPlayer => { // Callback that gets called whenever a player connects with the session
                    this.players.push(newPlayer); // Add player to the list
                    // Create a tablerow with a textnode that contains the player's name
                    let tableRow = document.createElement("tr");
                    tableRow.appendChild(document.createTextNode(newPlayer.firstName + " " + newPlayer.lastName));
                    tableRow.classList.add("player");
                    let table = document.getElementsByClassName("sessionTable")[0];
                    table.appendChild(tableRow); // Append the tablerow to the table

                    this.playerCount = this.playerCount + 1; //display number of players in top right corner

                }, removedPlayer => { // Gets called when a player leaves the session
                    this.players = this.players.filter(x => x.email != removedPlayer.email); // Remove player from the list

                    // Remove player from DOM
                    let htmlPlayers = document.getElementsByClassName("player"); // get all tr's with class player
                    for (let i = 0; i < htmlPlayers.length; i++) {
                        if (htmlPlayers[i].childNodes[0].textContent == removedPlayer.name) { // if the name is equal to removed player
                            htmlPlayers[i].remove(); // remove the node
                        }
                    }

                    this.playerCount = this.playerCount - 1; //display number of players in top right corner
                });

                this.socketService.listenForSubmits((data) => {
                    var submitTable = document.getElementsByClassName('submitTable')[0];
                    //var dataNode = document.createTextNode(data.player.name);
                    var tablerow = document.createElement('tr');
                    tablerow.innerHTML = `<strong>${data.player.name}:</strong> ${data.message}<br>`
                    //tablerow.appendChild(dataNode);
                    submitTable.appendChild(tablerow);
                });
            }

            if (this.userDetails.role == "student") {
                this.socketService.listenForQuestion(question => {
                    console.log(question);
                });
            }
        });

        window.addEventListener('beforeunload', this.beforeUnload);

        if (this.gameData == undefined) {
            this.router.navigate(['home']);
        }
    }

    beforeUnload(e) {
        e.returnValue = "Weet je zeker dat je de sessie wilt verlaten?";
        return "Weet je zeker dat je de sessie wilt verlaten?";
    }

    leaveSession() {
        this.socketService.leaveSession();
    }

    isHostDisconnected(): boolean {
        return this.socketService.hostDisconnected;
    }

    getGameData(): any {
        return this.socketService.gameData;
    }

    sendQuestion(question: string) {
        this.socketService.sendQuestion(question);
    }

    submit(data) {
        this.socketService.studentSubmit(data);
    }

    startGame() {
        this.gameStarted = true;
        this.socketService.startGame();

        let time = this.gameData?.duration * 60; // specified time for this activity (in seconds)
        this.startTimer(time);
    }


    startTimer(time: number) {
        setTimeout(() => {
            // TODO: redirect naar home ofzo en update bubblewaarden alles
        }, time * 1000);
        this.interval = setInterval(() => {
            if(time > 0) {
                time -= 1;
                let minutes = Math.floor(time / 60);
                let seconds = time % 60;
                if (seconds < 10) {
                    document.getElementsByClassName('timeLeft')[0].innerHTML = `Tijd over: <br><strong>${minutes}:0${seconds}</strong>`;
                } else {
                    document.getElementsByClassName('timeLeft')[0].innerHTML = `Tijd over: <br><strong>${minutes}:${seconds}</strong>`;
                }
            } else {
                clearInterval(this.interval);
            }
        }, 1000);
    }

    pairStudentsTest() {
        this.socketService.pairStudents(false, 2, pairs => {

        });
    }
}
