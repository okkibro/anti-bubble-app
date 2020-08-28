/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * This file contains all methods used by socketIO for our implementation of sockets for the classical
 * game sessions.
 * @packageDocumentation
 */

import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { DataService } from './data-exchange.service';

@Injectable({
	providedIn: 'root'
})

export class SocketIOService {
	socket = io(environment.ENDPOINT);
	players;
	pin;
	hostDisconnected;
	gameData;
	removedListeners;

	/**
	 * SocketIOService constructor.
	 * @param data
	 */
	constructor(private data: DataService) { }

	/**
	 * Method to create a new session using socketIO.
	 * @return
	 */
	createSession(gameData): void {
		this.removedListeners = false;
		this.gameData = gameData;
		this.socket.emit('host-join', gameData);
		this.socket.on('showGamePin', (pin) => {
			this.data.changeMessage(pin);
			this.pin = pin;
		});
	}

	/**
	 * Method that adds the given user to the session with the given pin.
	 * join gets called at the end and returns whether the join was a succes or not.
	 * backToHome gets called when the host disconnects.
	 * redirect gets called when the game starts.
	 * @param pin Code of session to join.
	 * @param user User that wants to join the session.
	 * @param join join() callback function.
	 * @param backToHome backToHome() callback function.
	 * @param redirect redirect() callback function.
	 * @param finishedGame finishedGame() callback function.
	 * @return
	 */
	joinSession(pin: string, user: User, join: Function, backToHome: Function, redirect: Function, finishedGame: Function): void {
		this.hostDisconnected = false;
		this.socket.emit('player-join', { pin: pin, player: user });
		this.socket.on('join-succes', (gameData) => {
			this.data.changeMessage(pin);
			this.gameData = gameData;

			// After player-join return succes to the angular component.
			join(true);
		});
		this.socket.on('join-failure', () => {
			join(false);
		});
		this.socket.on('host-disconnect', () => {
			this.hostDisconnected = true;
			this.socket.removeAllListeners();

			// When the host disconnects, call the function that sends the player back to the home screen.
			backToHome();
		});
		this.socket.on('game-start-redirect', () => {
			redirect();
		});
		this.socket.on('finished-game', () => {
			finishedGame();
		});
	}

	/**
	 * Method that removes the student from a session.
	 * @return
	 */
	leaveSession(): void {
		this.socket.emit('leave');
		this.socket.on('remove-listeners', () => {
			this.socket.removeAllListeners();
			this.removedListeners = true;
		});
	}

	/**
	 * Method to send a message in the joined session.
	 * @param message Message to be sent.
	 * @return
	 */
	sendMessage(message: string): void {
		this.socket.emit('message', message);
	}

	/**
	 * Method that listens for updates on players joining and leaving.
	 * addPlayer gets called when a player joins.
	 * removePlayer gets called when a player leaves.
	 * @param addPlayer addPlayer() callback function.
	 * @param removePlayer removePlayer() callback function.
	 * @return
	 */
	listenForUpdates(addPlayer: Function, removePlayer: Function): void {
		this.socket.on('update-players', player => {
			addPlayer(player);
		});
		this.socket.on('remove-player', player => {
			removePlayer(player);
		});
	}

	/**
	 * Method that listens for updates on players leaving so they can be removed from the
	 * previously recorded session players.
	 * @param deletePlayer deletePlayer() callback function.
	 * @return
	 */
	listenForLeavePlayer(deletePlayer: Function): void {
		this.socket.on('player-left', player => {
			deletePlayer(player);
		});
	}

	/**
	 * Method that listens for incoming questions.
	 * receiveQuestion gets called when a question is received from the teacher.
	 * @param receiveQuestion receiveQuestion() callback function.
	 * @return
	 */
	listenForQuestion(receiveQuestion: Function): void {
		this.socket.on('receive-question', (question) => {
			receiveQuestion(question);
		});
	}

	/**
	 * Method that listens for the emissions of the 'finished-game' signal for when the session has
	 * ended, either by the time runnning out or the teacehr pressing the 'Stop activiteit' button.
	 * disableInput gets called when the teacher presses said button.
	 * @param disableInput disableInput() callback function.
	 * @return
	 */
	listenForFinishGame(disableInput: Function): void {
		this.socket.on('finished-game', timedOut => {
			disableInput(timedOut);
		});
	}

	/**
	 * Method that listens for receiving of teams.
	 * @param receiveTeam receiveTeam() callback function.
	 * @return
	 */
	listenForTeam(receiveTeam: Function): void {
		this.socket.on('receive-team', (team, article, leaders) => {
			receiveTeam(team, article, leaders);
		});
	}

	/**
	 * Method that listens for incoming answer submits.
	 * receiveSubmit gets called when an answer from a student is received.
	 * @param receiveSubmit receiveSubmit() callback function.
	 * @return
	 */
	listenForSubmits(receiveSubmit: Function): void {
		this.socket.on('receive-submit', data => {
			receiveSubmit(data);
		});
	}

	/**
	 * Method that listens for someone wanting to know the players in the current session.
	 * receivePlayers gets called when the session is started and the list of players is needed.
	 * @param getSessionPlayers getSessionPlayers() callback function.
	 * @return
	 */
	listenForGetPlayers(getSessionPlayers: Function): void {
		this.socket.on('got-players', sessionPlayers => {
			getSessionPlayers(sessionPlayers);
		});
	}

	/**
	 * Method that listens for the student submitting an answer so it can be recorded.
	 * @param recordAnswer recordAnswer() callback function.
	 * @return
	 */
	listenForRecordAnswer(recordAnswer: Function): void {
		this.socket.on('record-answer', answer => {
			recordAnswer(answer);
		});
	}

	/**
	 * Method that listens for host removing an answer from a student so it can be deleted from
	 * the student' recorded answers.
	 * @param deleteAnswer deleteAnswer() callback function.
	 * @return
	 */
	listenForRemoveAnswer(deleteAnswer: Function): void {
		this.socket.on('delete-answer', answer => {
			deleteAnswer(answer);
		});
	}

	/**
	 * Method that sends a question to all students in the session.
	 * @param question Quesiton to be sent to all students in session.
	 * @return
	 */
	teacherSubmit(question: string): void {
		this.socket.emit('send-question', question);
	}


	/**
	 * Method that submits an answer to the teacher.
	 * @param data Answer given by student.
	 * @return
	 */
	studentSubmit(data: any): void {
		this.socket.emit('submit', data);
	}

	/**
	 * Method that starts the game. Making it unable for new students to join.
	 * @return
	 */
	startGame(): void {
		this.socket.emit('start-game');
		this.socket.emit('get-players');
	}

	/**
	 * Method that pairs students in groups of the given groupsize. receivePairs() is called when
	 * the teacher has created the teams and sent them back.
	 * @param groups Array of groups of students only used when teacher created the groups manually.
	 * @param groupSize Size of the group.
	 * @param articles Articles to be paired to students in the group.
	 * @param receivePairs receivePairs() callback function.
	 * @return
	 */
	pairStudents(groups, groupSize, articles, receivePairs): void {
		this.socket.emit('pair-students', groups, groupSize, articles);
		this.socket.on('send-pairs', (pairs, leaders, sources, subjects) => {
			receivePairs(pairs, leaders, { sources: sources, subjects: subjects });
		});
	}

	/**
	 * Method that removes all listeners from the socket.
	 * @return
	 */
	removeListeners(): void {
		this.socket.removeAllListeners();
		this.removedListeners = true;
	}

	/**
	 * Method that will make a player's inactive button active again and remove his deleted answer
	 * from his answers that have been recorded.
	 * @param player
	 * @return
	 */
	activateStudentButton(player: any): void {
		this.socket.emit('reactivate-button', player);
		this.socket.emit('remove-answer', player)
	}

	/**
	 * Method that will take a callback that will be called when the player's answer got deleted by the teacher.
	 * @param reactivate reactivate() callback function.
	 * @return
	 */
	reactivateButton(reactivate: Function): void {
		this.socket.on('reactivate', () => {
			reactivate();
		});
	}

	/**
	 * Method that will finish a session.
	 * @param timedOut Whether the game finished by the time running out or the teacher manually stopping it.
	 * @return
	 */
	finishGame(timedOut: boolean): void {
		this.socket.emit('finish-game', timedOut);
	}
}