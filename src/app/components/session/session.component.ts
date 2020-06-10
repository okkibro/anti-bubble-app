import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { SocketIOService } from 'src/app/services/socket-io.service';
import { DataService } from 'src/app/services/data-exchage.service';
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
        private authenticationService: AuthenticationService,
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

        this.authenticationService.profile().subscribe(user => {
            this.userDetails = user;

            if (this.userDetails.role == "teacher") {
                this.socketService.listenForUpdates(newPlayer => { // Callback that gets called whenever a player connects with the session.
                    this.players.push(newPlayer); // Add player to the list.
                    // Create a tablerow with a textnode that contains the player's name.
                    let tableRow = document.createElement("tr");
                    tableRow.appendChild(document.createTextNode(newPlayer.firstName + " " + newPlayer.lastName));
                    tableRow.classList.add("player");
                    let table = document.getElementsByClassName("sessionTable")[0];
                    table.appendChild(tableRow); // Append the tablerow to the table.

                    this.playerCount = this.playerCount + 1; //Display number of players in top right corner.

                }, removedPlayer => { // Gets called when a player leaves the session.
                    this.players = this.players.filter(x => x.email != removedPlayer.email); // Remove player from the list.

                    // Remove player from DOM.
                    let htmlPlayers = document.getElementsByClassName("player"); // Get all tr's with class player.
                    for (let i = 0; i < htmlPlayers.length; i++) {
                        if (htmlPlayers[i].childNodes[0].textContent == removedPlayer.name) { // If the name is equal to removed player.
                            htmlPlayers[i].remove(); // Remove the node.
                        }
                    }

                    this.playerCount = this.playerCount - 1; // Display number of players in top right corner.
                });

                // Call function that listens for students to submit answers.
                this.socketService.listenForSubmits((data) => { // Receive answer from student.

                    // Add answer to screen using DOM manipulation.
                    var submitTable = document.getElementsByClassName('submitTable')[0];
                    var tablerow = document.createElement('tr');
                    tablerow.innerHTML = `<strong>${data.player.name}:</strong> ${data.message}<br>`
                    submitTable.appendChild(tablerow);
                });
            }

            // Students listen for incoming questions.
            if (this.userDetails.role == "student") {
                this.socketService.listenForQuestion(question => { // Receive question.
                    // TODO: show question on screen of student.
                    console.log(question);
                });
            }
        });

        // Show confirm when trying to refresh or close the current tab with an ongoing session.
        window.addEventListener('beforeunload', this.beforeUnload);

        // Going to session page but not having joined a session redirects a user back to the home page.
        if (this.gameData == undefined) {
            this.router.navigate(['home']);
        }
    }

    beforeUnload(e) {
        e.returnValue = "Weet je zeker dat je de sessie wilt verlaten?";
        return "Weet je zeker dat je de sessie wilt verlaten?";
    }

    logoutButton() {
        return this.authenticationService.logout();
    }

    /** Function that calls the leave session function in the socket io service. */
    leaveSession() {
        this.socketService.leaveSession();
    }

    /** Function that returns if a student leaving the session was caused by the host disconnecting. */
    isHostDisconnected(): boolean {
        return this.socketService.hostDisconnected;
    }

    /** Function that returns the game data. */
    getGameData(): any {
        return this.socketService.gameData;
    }

    /** Function that sends the passed question to all students in the session. */
    sendQuestion(question: string) {
        this.socketService.sendQuestion(question);
    }

    /** Function that submits the passed answer to the host of the session. */
    submit(data) {
        this.socketService.studentSubmit(data);
    }

    /** Function that starts the game. Making it unable for students to join the session. */
    startGame() {
        this.gameStarted = true;
        this.socketService.startGame();

        let time = this.gameData?.duration * 60; // specified time for this activity (in seconds)
        this.startTimer(time);
    }

    /** Function that makes timer count down at the top of the screen. */
    startTimer(time: number) {
        setTimeout(() => {
            // TODO: redirect naar home ofzo en update bubblewaarden alles
        }, time * 1000);

        // Create an interval that calls the given function every second. 
        // The function updates the value of the time at the top of the screen to be 1 second less than the previous second it was called.
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

    /** Test function that tests if pairStudents works. */
    pairStudentsTest() {
        this.socketService.pairStudents(false, 2, pairs => {
            console.log(pairs);
        });
    }
}
