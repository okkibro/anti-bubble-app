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

    /**  Method to join a live session. */
    joinSession(pin, user, join, backToHome, redirect) {
        this.hostDisconnected = false;
        this.socket.emit('player-join', {pin: pin, player: user});
        this.socket.on('message', (message: string) => {
            console.log(message);
        });
        this.socket.on('join-succes', (gameData) => {
            this.data.changeMessage(pin);
            this.gameData = gameData;
            join(true); // After player-join return succes to the angular component.
        });
        this.socket.on('join-failure', () => {
            join(false);
        })
        this.socket.on('host-disconnect', () => {
            this.hostDisconnected = true;
            this.socket.removeAllListeners();
            backToHome(); // When the host disconnects, call the function that sends the player back to the home screen.
        });
        this.socket.on('game-start-redirect', () => {
            redirect();
        })
    }

    /**  Method to send a message in the joined session. */
    sendMessage(message) {
        this.socket.emit('message', message);
    }

    /**  Method to check for updates on the playerlist. */
    listenForUpdates(addPlayer, removePlayer) {
        this.socket.on('update-players', player => {
            addPlayer(player);
        });
        this.socket.on('remove-player', player => {
            removePlayer(player);
        });
    }

    /**  Method to leave the session. */
    leaveSession() {
        this.socket.emit('leave');
        this.socket.on('remove-listeners', () => {
            this.socket.removeAllListeners();
            this.removedListeners = true;
        });
    }

    /**  Method to send a question. */
    sendQuestion(question) {
        this.socket.emit('send-question', question);
    }

    /**  Method to listen for incomming questions. */
    listenForQuestion(receiveQuestion) {
        this.socket.on('receive-question', (question) => {
            receiveQuestion(question);
        });
    }

    /**  Method to submit an answer of a student. */
    studentSubmit(data) {
        this.socket.emit('submit', data);
    }

    /**  Method to listen for submits. */
    listenForSubmits(receiveSubmit) {
        this.socket.on('receive-submit', data => {
            receiveSubmit(data);
        });
    }

    /**  Method to start the game */
    startGame() {
        this.socket.emit('start-game');
    }

    /**  Method to pair students so they can chat given an groupsize. */
    pairStudents(chat, groupSize, receivePairs) {
        this.socket.emit('pair-students', chat, groupSize);
        this.socket.on('send-pairs', (pairs) => {
            receivePairs(pairs);
        });
    }
}
