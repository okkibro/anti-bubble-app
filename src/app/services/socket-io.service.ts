/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { DataService } from './data-exchange.service';

@Injectable({
    providedIn: 'root'
})
export class SocketIOService {
    socket = io(environment.ENDPOINT);
    pin;
    hostDisconnected;
    gameData;
    removedListeners;

    constructor(private data: DataService) { }

    /**  Method to create a new session usig socketIO. */
    createSession(gameData) {
        this.removedListeners = false;
        console.log(gameData)
        this.gameData = gameData;
        this.socket.emit('host-join', gameData);
        this.socket.on('players', (players: []) => {
            console.log(0, players);
        });
        this.socket.on('showGamePin', (pin) => {
            this.data.changeMessage(pin);
            this.pin = pin;
        });
    }

    /** Method that adds the given user to the session with the given pin. 
     *  join gets called at the end and returns whether the join was a succes or not.
     *  backToHome gets called when the host disconnects.
     *  redirect gets called when the game starts.
     */
    joinSession(pin, user, join, backToHome, redirect, finishedGame) {
        this.hostDisconnected = false;
        this.socket.emit('player-join', { pin: pin, player: user });
        this.socket.on('message', (message: string) => {
            console.log(message);
        });
        this.socket.on('join-succes', (gameData) => {
            this.data.changeMessage(pin);
            this.gameData = gameData;

            // After player-join return succes to the angular component.
            join(true);
        });
        this.socket.on('join-failure', () => {
            join(false);
        })
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
        })
    }

    /**  Method to send a message in the joined session. */
    sendMessage(message) {
        this.socket.emit('message', message);
    }

    /** Method that listens for updates on players joining and leaving.
     *  addPlayer gets called when a player joins.
     *  removePlayer gets called when a player leaves.
     */
    listenForUpdates(addPlayer, removePlayer) {
        this.socket.on('update-players', player => {
            addPlayer(player);
        });
        this.socket.on('remove-player', player => {
            removePlayer(player);
        });
    }

    /** Method that removes the student from a session. */
    leaveSession() {
        this.socket.emit('leave');
        this.socket.on('remove-listeners', () => {
            this.socket.removeAllListeners();
            this.removedListeners = true;
        });
    }

    /** Method that sends a question to all students in the session. */
    sendQuestion(question) {
        this.socket.emit('send-question', question);
    }

    /** Method that listens for incoming questions.
     *  receiveQuestion gets called when a question is received from the teacher.
     */
    listenForQuestion(receiveQuestion) {
        this.socket.on('receive-question', (question) => {
            receiveQuestion(question);
        });
    }

    listenForTeam(receiveTeam) {
        this.socket.on('receive-team', (team, article, leaders) => {
            receiveTeam(team, article, leaders);
        });
    }

    /** Method that submits an answer to the teacher. */
    studentSubmit(data) {
        this.socket.emit('submit', data);
    }

    /** Method that listens for incoming answer submits.
     *  receiveSubmit gets called when an answer from a student is received.
     */
    listenForSubmits(receiveSubmit) {
        this.socket.on('receive-submit', data => {
            receiveSubmit(data);
        });
    }

    /** Method that starts the game. Making it unable for new students to join. */
    startGame() {
        this.socket.emit('start-game');
    }

    /** Method that pairs students in groups of the given groupsize.
     *  receivePairs is called when the ser has created the teams and sent them back.
     */
    pairStudents(groups, groupSize, articles, receivePairs) {
        this.socket.emit('pair-students', groups, groupSize, articles);
        this.socket.on('send-pairs', (pairs, leaders, sources, subjects) => {
            receivePairs(pairs, leaders, { sources: sources, subjects: subjects });
        });
    }

    /** Method that removes all listeners from the socket. */
    removeListeners() {
        this.socket.removeAllListeners();
        this.removedListeners;
    }

    /** Method that will make a player's inactive button active again. */
    activateStudentButton(player) {
        this.socket.emit('reactivate-button', player);
    }

    /** Method that will take a callback that will be called when the player's answer got deleted by the teacher. */
    reactivateButton(reactivate) {
        this.socket.on('reactivate', () => {
            reactivate();
        });
    }

    /** Method that will finish a session */
    finishGame() {
        this.socket.emit('finish-game');
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */