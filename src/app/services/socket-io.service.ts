import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { DataService } from './data-exchage.service';
import { Observable } from 'rxjs';

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

    /** Function that creates a new session. */
    createSession(gameData) {
        this.removedListeners = false;
        this.gameData = gameData;
        this.socket.emit('host-join', gameData);
        this.socket.on('players', (players: []) => {
            console.log(0,players);
        });
        this.socket.on('showGamePin', (pin) => {
            this.data.changeMessage(pin);
            this.pin = pin;
        });        
    }

    /** Function that adds the given user to the session with the given pin. 
     *  join gets called at the end and returns whether the join was a succes or not.
     *  backToHome gets called when the host disconnects.
     *  redirect gets called when the game starts.
     */
    joinSession(pin, user, join, backToHome, redirect) {
        this.hostDisconnected = false;
        this.socket.emit('player-join', {pin: pin, player: user});
        this.socket.on('message', (message: string) => {
            console.log(message);
        });
        this.socket.on('join-succes', (gameData) => {
            this.data.changeMessage(pin);
            this.gameData = gameData;
            join(true); // After player-join return succes to the angular component
        });
        this.socket.on('join-failure', () => {
            join(false);
        })
        this.socket.on('host-disconnect', () => {
            this.hostDisconnected = true;
            this.socket.removeAllListeners();
            backToHome(); // When the host disconnects, call the function that sends the player back to the home screen
        });
        this.socket.on('game-start-redirect', () => {
            redirect();
        })
    }

    sendMessage(message) {
        this.socket.emit('message', message);
    }

    /** Function that listens for updates on players joining and leaving.
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

    /** Function that removes the student from a session. */
    leaveSession() {
        this.socket.emit('leave');
        this.socket.on('remove-listeners', () => {
            this.socket.removeAllListeners();
            this.removedListeners = true;
        });
    }

    /** Function that sends a question to all students in the session. */
    sendQuestion(question) {
        this.socket.emit('send-question', question);
    }

    /** Function that listens for incoming questions.
     *  receiveQuestion gets called when a question is received from the teacher.
     */
    listenForQuestion(receiveQuestion) {
        this.socket.on('receive-question', (question) => {
            receiveQuestion(question);
        });
    }

    /** Function that submits an answer to the teacher. */
    studentSubmit(data) {
        this.socket.emit('submit', data);
    }

    /** Function that listens for incoming answer submits.
     *  receiveSubmit gets called when an answer from a student is received.
     */
    listenForSubmits(receiveSubmit) {
        this.socket.on('receive-submit', data => {
            receiveSubmit(data);
        });
    }

    /** Function that starts the game. Making it unable for new students to join. */
    startGame() {
        this.socket.emit('start-game');
    }

    /** Function that pairs students in groups of the given groupsize.
     *  receivePairs is called when the ser has created the teams and sent them back.
     */
    pairStudents(chat, groupSize, receivePairs) {
        this.socket.emit('pair-students', chat, groupSize);
        this.socket.on('send-pairs', (pairs) => {
            receivePairs(pairs);
        });
    }
}
