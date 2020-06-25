/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { DataService } from 'src/app/services/data-exchange.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { beforeUnload } from '../../../../constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Articles } from 'src/app/models/articles';

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
    gameFinished = false;
    leaveByHomeButton = false;
    enableQuestions: boolean = false;
    pairs;
    randomGroups: boolean;
    submits: any[][] = [];
    leaders;
    sources;
    subjects;

    constructor(
        private authenticationService: AuthenticationService,
        private socketService: SocketIOService,
        private data: DataService,
        private router: Router,
        private sessionService: SessionService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.gameStarted = false;
        this.randomGroups = true;
        this.gameData = this.getGameData();

        if (this.gameData == undefined) {

            // Going to session page but not having joined a session redirects a user back to the home page.
            this.router.navigate(['home']);
        } else {
            if (this.gameData.teams != undefined && this.gameData.teams === 'Handmatig') {
                this.randomGroups = false;
            }

            // Get pin of the session from the dataservice
            this.data.currentMessage.subscribe(message => {
                if (message) {
                    this.pin = message;
                    this.socketService.pin = message;
                }
            });

            this.authenticationService.profile().subscribe(user => {
                this.userDetails = user;

                if (this.userDetails.role == 'teacher') {

                    // Callback that gets called whenever a player connects with the session.
                    this.socketService.listenForUpdates(newPlayer => {

                        // Add player to the list.
                        this.players.push(newPlayer);

                        // Create a tablerow with a textnode that contains the player's name.
                        let tableRow = document.createElement('tr');
                        tableRow.appendChild(document.createTextNode(newPlayer.firstName + ' ' + newPlayer.lastName));
                        tableRow.classList.add('player');

                        // Create a input field where the teacher can group teams manually.
                        if (!this.randomGroups) {
                            let input = document.createElement('input');
                            let space = document.createTextNode(': ');
                            input.setAttribute('placeholder', 'Team nr.');
                            input.setAttribute('id', newPlayer.email);
                            input.setAttribute('type', 'number');

                            // No groups with negative numbers.
                            input.setAttribute('min', '1');
                            input.classList.add('teamInput');
                            tableRow.appendChild(space);
                            tableRow.appendChild(input);
                        }
                        let table = document.getElementsByClassName('sessionTable')[0];
                        
                        // Append the tablerow to the table.
                        table.appendChild(tableRow);

                        //Display number of players in top right corner.
                        this.playerCount = this.playerCount + 1;

                        // Gets called when a player leaves the session.
                    }, removedPlayer => {

                        // Remove player from the list.
                        this.players = this.players.filter(x => x.email != removedPlayer.email);

                        // Remove player from DOM.
                        // Get all tr's with class player.
                        let htmlPlayers = document.getElementsByClassName('player');
                        for (let i = 0; i < htmlPlayers.length; i++) {

                            // If the name is equal to removed player.
                            if (htmlPlayers[i].childNodes[0].textContent == removedPlayer.name) {
                                htmlPlayers[i].remove(); // Remove the node.
                            }
                        }

                        // Display number of players in top right corner.
                        this.playerCount = this.playerCount - 1;
                    });

                    // Naamloos Nieuws works with a different submit system
                    if (this.gameData.game.name != 'Naamloos Nieuws') {

                        // Call function that listens for students to submit answers.
                        // Receive answer from student.
                        this.socketService.listenForSubmits((data) => {

                            // Add answer to screen using DOM manipulation.
                            let submitTable = document.getElementsByClassName('submitTable')[0];
                            let tablerow = document.createElement('tr');
                            let breakLine = document.createElement('br');
                            let deleteButton = document.createElement('button');
                            deleteButton.style.width = '25px';
                            deleteButton.style.height = '25px';
                            deleteButton.style.backgroundColor = 'red';
                            deleteButton.style.color = 'white';
                            deleteButton.innerHTML = 'X';
                            deleteButton.addEventListener('click', () => {
                                deleteButton.parentElement.remove();
                                this.socketService.activateStudentButton(data.player);
                            });
                            tablerow.innerHTML = `<strong>${ data.player.name}:</strong> ${ data.message} `
                            tablerow.appendChild(deleteButton);
                            tablerow.appendChild(breakLine);
                            submitTable.appendChild(tablerow);

                            // Teacher cannot send any questions after having received at least one answer
                            this.enableQuestions = false;
                        });
                    }
                }
            });

            // Show confirm when trying to refresh or close the current tab with an ongoing session.
            window.addEventListener('beforeunload', beforeUnload);
        }
    }

    /** Method that calls the leave session function in the socket io service. */
    leaveSession() {
        this.socketService.leaveSession();
    }

    /** Method that returns if a student leaving the session was caused by the host disconnecting. */
    isHostDisconnected(): boolean {
        return this.socketService.hostDisconnected;
    }

    /** Method that returns the game data. */
    getGameData(): any {
        return this.socketService.gameData;
    }

    /** Method that sends the passed question to all students in the session. */
    sendQuestion(question: string) {
        this.socketService.sendQuestion(question);
    }

    /** Method that submits the passed answer to the host of the session. */
    submit(data) {
        this.socketService.studentSubmit(data);
    }

    /** Method that starts the game. Making it unable for students to join the session. */
    startGame() {

        // teacher wants to start a game without any players in it
        if (this.playerCount == 0) {
            this.snackBar.open('Er zitten nog geen spelers in de sessie', 'X', { duration: 2500, panelClass: ['style-error'], });
        } else {
            if (this.canStart(this.gameData.game.name)) {
                this.gameStarted = true;
                this.socketService.startGame();
                this.initGame(this.gameData.game.name);

                // Specified time for this activity (in seconds)
                let time = this.gameData?.duration * 60;
                this.startTimer(time);
            }
        }
    }

    /** Method that takes the game name and will return whether the game can start or not. */
    canStart(game: string): Boolean {
        switch (game) {
            case 'Naamloos Nieuws':
                if (this.playerCount < 3) {
                    this.snackBar.open('Er moeten minstens 6 leerlingen meedoen met deze activiteit', 'X', { duration: 2500, panelClass: ['style-error'] });
                    return false;
                } else {
                    return true;
                }
            case 'Botsende Bubbels':
                return true;
        }
    }

    /** Method that initializes the game based on the given game name. */
    initGame(game: string) {
        switch (game) {
            case 'Naamloos Nieuws':

                // Get articles from database.
                this.sessionService.getArticles().subscribe((articles) => {

                    // Divide students in groups of 3.
                    this.pairStudents(null, 3, articles, (pairs, leaders, sourceSubject) => {
                        this.leaders = leaders;
                        this.pairs = pairs;
                        this.sources = sourceSubject.sources;
                        this.subjects = sourceSubject.subjects;
                        for (let i = 0; i < leaders.length; i++) {

                            // Make a list in submits for every leader.
                            this.submits[leaders[i].email] = [];
                        }

                        this.socketService.listenForSubmits(submit => {
                            this.submits[submit.message.answer].push({ 
                                player: submit.player, 
                                source: submit.message.data.article.source, 
                                subject: submit.message.data.article.subject 
                            });
                        });
                    });
                });
                break;

            case 'Botsende Bubbels':
                this.enableQuestions = true;
                break;
            case 'Alternatieve Antwoorden': break;
            case 'Aanradend Algoritme': break;
        }
    }

    /** Method that makes timer count down at the top of the screen. */
    startTimer(time: number) {
        setTimeout(() => {
            this.finishGame();
        }, time * 1000);

        // Create an interval that calls the given function every second. 
        // The function updates the value of the time at the top of the screen to be 1 second less than the previous second it was called.
        this.interval = setInterval(() => {
            if (time > 0) {
                time -= 1;
                let minutes = Math.floor(time / 60);
                let seconds = time % 60;
                if (seconds < 10) {
                    document.getElementsByClassName('timeLeft')[0].innerHTML = `Tijd over: <br><strong>${minutes}:0${seconds}</strong>`;
                } else {
                    document.getElementsByClassName('timeLeft')[0].innerHTML = `Tijd over: <br><strong>${minutes}:${seconds}</strong>`;
                }
            } else {
                this.stopGame();
            }
        }, 1000);
    }

    /** Method that groups students. */
    pairStudents(groups: String[][], groupSize: Number, articles: Articles, receivePairs) {
        this.socketService.pairStudents(groups, groupSize, articles, (pairs, leaders, sources) => {
            receivePairs(pairs, leaders, sources);
        });
    }

    /** Method that stops the timer and game. */
    stopGame() {
        this.gameFinished = true;
        clearInterval(this.interval);
        let timeLeft = <HTMLElement[]><any>document.querySelectorAll('.timeLeft');
        timeLeft[0].style.color = 'red';

        // Remove all listeners so students cant submit answers.
        this.socketService.removeListeners();
        this.showAnswersonScreen(this.gameData.game.name);
        this.finishGame();
    }

    /** Method that makes the host leave the session and the page. */
    leaveGame() {
        this.leaveSession();
        this.leaveByHomeButton = true;
        window.removeEventListener('beforeunload', beforeUnload);
        this.router.navigate(['home']);
    }

    showAnswersonScreen(game: String) {
        switch (game) {
            case 'Naamloos Nieuws':
                let table = document.getElementsByClassName('submitTable')[0];
                for (let i = 0; i < this.leaders.length; i++) {
                    let team = document.createElement('tr');
                    team.innerHTML = `<strong>Team ${i + 1}</strong><br>`;
                    team.innerHTML += `Speler 1: ${this.leaders[i].name}<br> <i>Onderwerp: ${this.subjects[i]}</i> <br> <i>Source: ${this.sources[i]}<i><br><br>`;
                    let teamSubmits = this.submits[this.leaders[i].email]
                    for (let j = 0; j < teamSubmits.length; j++) {
                        team.innerHTML += `Speler ${j + 2}: ${teamSubmits[j].player.name}<br> <i>Onderwerp: ${teamSubmits[j].subject}</i> <br> <i>Source: ${teamSubmits[j].source}<i><br><br>`;
                    }
                    table.appendChild(team);
                }
                break;
            default: break;
        }
    }

    finishGame() {
        this.sessionService.earnMoney(100).subscribe();
        this.socketService.finishGame();
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */