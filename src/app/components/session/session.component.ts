/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * session.component.ts
 * This file handles all the logic for handling resetting the user's old password by setting a new one through
 * a form. This page can only be visited by a user who is already registered in the database, requested a new
 * password through the password-recovery component and clicked the link with the correct reset token.
 * @packageDocumentation
 */

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { DataService } from 'src/app/services/data-exchange.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { beforeUnload } from '../../../../constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Article } from 'src/app/models/article';
import { tokenData } from '../../models/tokenData';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { earnAmount } from '../../../../constants';

@Component({
	selector: 'mean-session',
	templateUrl: './session.component.html',
	styleUrls: ['./session.component.css',
		'../../shared/general-styles.css']
})

export class SessionComponent implements OnInit {
	tokenData: tokenData;
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
	timedOut: boolean = false;
	earnAmount: number = 5;

	/**
	 * SessionComponent constructor.
	 * @param auth
	 * @param socketService
	 * @param data
	 * @param router
	 * @param sessionService
	 * @param snackBar
	 * @param titleService
	 */
	constructor(
		private auth: AuthenticationService,
		private socketService: SocketIOService,
		private data: DataService,
		private router: Router,
		private sessionService: SessionService,
		private snackBar: MatSnackBar,
		private titleService: Title
	) { }

	/**
	 * Initialization method.
	 * @returns
	 */
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

			this.tokenData = this.auth.getTokenData();
			if (this.tokenData.role === 'teacher') {

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
					let table = document.getElementsByClassName('session-table')[0];

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
						if (htmlPlayers[i].childNodes[0].textContent === removedPlayer.name) {
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
						let submitTable = document.getElementsByClassName('submit-table')[0];
						let tablerow = document.createElement('tr');
						let breakLine = document.createElement('br');
						let deleteButton = document.createElement('button');
						deleteButton.classList.add('hover');
						deleteButton.style.backgroundColor = '#f44336';
						deleteButton.style.color = 'white';
						deleteButton.style.borderRadius = '5px';
						deleteButton.style.boxShadow = '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)';
						deleteButton.style.fontFamily = '\'Material Icons\', serif';
						deleteButton.innerHTML = 'clear';
						deleteButton.style.height = '25px';
						deleteButton.style.width = '25px';
						deleteButton.style.border = '0px solid transparent';
						deleteButton.style.cursor = 'pointer';
						deleteButton.addEventListener('click', () => {
							deleteButton.parentElement.remove();
							this.socketService.activateStudentButton(data.player);
						});
						tablerow.innerHTML = `<strong>${data.player.name.split(' ')[0]}:</strong> ${data.message} `;
						tablerow.appendChild(deleteButton);
						tablerow.appendChild(breakLine);
						submitTable.appendChild(tablerow);

						// Teacher cannot send any questions after having received at least one answer
						this.enableQuestions = false;
					});
				}
			}

			// Show confirm when trying to refresh or close the current tab with an ongoing session.
			window.addEventListener('beforeunload', beforeUnload);
		}

		this.titleService.setTitle('Sessie' + environment.TITLE_TRAIL);
	}

	/**
	 * Method that calls the leave session function in the socket io service.
	 * @returns
	 */
	leaveSession() {
		this.socketService.leaveSession();
	}

	/**
	 * Method that returns if a student leaving the session was caused by the host disconnecting.
	 * @returns Whether student leaving was caused by teacher disconnecting.
	 */
	isHostDisconnected(): boolean {
		return this.socketService.hostDisconnected;
	}

	/**
	 * Method that returns the game data.
	 * @returns Data of the game.
	 */
	getGameData(): any {
		return this.socketService.gameData;
	}

	/**
	 * Method that submits the passed answer to the host of the session.
	 * @param data Student's answer.
	 */
	submit(data: string) {
		this.socketService.studentSubmit(data);
	}

	/**
	 * Method that starts the game. Making it unable for students to join the session.
	 * @returns
	 */
	startGame() {

		// Teacher wants to start a game without any players in it.
		if (this.playerCount === 0) {
			this.snackBar.open('Er zitten nog geen spelers in de sessie', 'X', { duration: 2500, panelClass: ['style-warning'] });
		} else {
			if (this.canStart(this.gameData.game.name)) {
				this.gameStarted = true;
				this.socketService.startGame();
				this.initGame(this.gameData.game.name);

				// Specified time for this activity (in seconds).
				let time = this.gameData?.duration * 60;
				this.startTimer(time);
			}
		}
	}

	/** Method that takes the game name and will return whether the game can start or not.
	 * @param game Type of the activity.
	 * @returns Whether it is possible to start the game.
	 */
	canStart(game: string): boolean {
		switch (game) {
			case 'Naamloos Nieuws':
				if (this.playerCount < 3) {
					this.snackBar.open('Er moeten minstens 6 leerlingen meedoen met deze activiteit', 'X', { duration: 2500, panelClass: ['style-warning'] });
					return false;
				} else {
					return true;
				}
			case 'Botsende Bubbels':
				return true;
		}
	}

	/** Method that initializes the game based on the given game name.
	 * @param game Type of the activity.
	 * @returns
	 */
	initGame(game: string): void {
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
			case 'Alternatieve Antwoorden':
				break;
			case 'Aanradend Algoritme':
				break;
		}
	}

	/**
	 * Method that makes timer count down at the top of the screen.
	 * @param time Amount of time to play the game.
	 * @returns
	 */
	startTimer(time: number): void {

		// Create an interval that calls the given function every second.
		// The function updates the value of the time at the top of the screen to be 1 second less than the previous second it was called.
		this.interval = setInterval(() => {
			if (time > 0) {
				time -= 1;
				let minutes = Math.floor(time / 60);
				let seconds = time % 60;
				if (seconds < 10) {
					document.getElementById('counter').innerHTML = `Tijd over: <br><strong>${minutes}:0${seconds}</strong>`;
				} else {
					document.getElementById('counter').innerHTML = `Tijd over: <br><strong>${minutes}:${seconds}</strong>`;
				}
			} else {
				this.timedOut = true;
				this.stopGame(true);
			}
		}, 1000);
	}

	/**
	 * Method that groups students into groups of a certain size for the 'Naamloos Nieuws' activity.
	 * @param groups Array of groups of students only used when teacher created the groups manually.
	 * @param groupSize Size of the group.
	 * @param articles Articles to be paired to students in the group.
	 * @param receivePairs Callback function.
	 */
	pairStudents(groups: string[][], groupSize: number, articles: Article, receivePairs: Function): void {
		this.socketService.pairStudents(groups, groupSize, articles, (pairs, leaders, sources) => {
			receivePairs(pairs, leaders, sources);
		});
	}

	/**
	 * Method that stops the timer and game.
	 * @param timedOut Whether the game finished by the time running out or the teacher manually stopping it.
	 * @returns
	 */
	stopGame(timedOut: boolean): void {
		this.gameFinished = true;
		clearInterval(this.interval);
		let timeLeft = document.getElementById('counter');
		timeLeft.style.color = 'red';

		// Remove all listeners so students can't continue to submit answers.
		this.socketService.removeListeners();
		this.showAnswersonScreen(this.gameData.game.name);
		this.socketService.finishGame(timedOut);
		this.sessionService.earnMoney(earnAmount).subscribe();
	}

	/**
	 * Method that makes the host leave the session and the page.
	 * @returns
	 */
	leaveGame(): void {
		this.leaveSession();
		this.leaveByHomeButton = true;
		window.removeEventListener('beforeunload', beforeUnload);
		this.router.navigate(['home']);
	}

	/**
	 * Method that shows the answer on screen when the game is finished.
	 * @param game Type of the activity.
	 * @returns
	 */
	showAnswersonScreen(game: string): void {
		switch (game) {
			case 'Naamloos Nieuws':
				let table = document.getElementsByClassName('submit-table')[0];
				for (let i = 0; i < this.leaders.length; i++) {
					let team = document.createElement('tr');
					team.innerHTML = `<strong>Team ${i + 1}</strong><br>`;
					team.innerHTML += `Speler 1: ${this.leaders[i].name}<br> <i>Onderwerp: ${this.subjects[i]}</i> <br> <i>Source: ${this.sources[i]}<i><br><br>`;
					let teamSubmits = this.submits[this.leaders[i].email];
					for (let j = 0; j < teamSubmits.length; j++) {
						team.innerHTML += `Speler ${j + 2}: ${teamSubmits[j].player.name}<br> <i>Onderwerp: ${teamSubmits[j].subject}</i> <br> <i>Source: ${teamSubmits[j].source}<i><br><br>`;
					}
					table.appendChild(team);
				}
				break;
			default:
				break;
		}
	}
}