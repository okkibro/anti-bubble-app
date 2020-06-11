import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { DataService } from './data-exchange.service';
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

    // Gets called when a teacher creates a new session
    createSession(gameData): void {
        this.removedListeners = false;
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

    // Gets called when a user enters a pin and presses the join session button
    joinSession(pin, user, join, backToHome, redirect): void {
        this.hostDisconnected = false;
        this.socket.emit('player-join', { pin: pin, player: user });
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

    sendMessage(message): void {
        this.socket.emit('message', message);
    }

    listenForUpdates(addPlayer, removePlayer): void {
        this.socket.on('update-players', player => {
            addPlayer(player);
        });
        this.socket.on('remove-player', player => {
            removePlayer(player);
        });
    }

    leaveSession(): void {
        this.socket.emit('leave');
        this.socket.on('remove-listeners', () => {
            this.socket.removeAllListeners();
            this.removedListeners = true;
        });
    }

    sendQuestion(question): void {
        this.socket.emit('send-question', question);
    }

    listenForQuestion(receiveQuestion): void {
        this.socket.on('receive-question', (question) => {
            receiveQuestion(question);
        });
    }

    studentSubmit(data): void {
        this.socket.emit('submit', data);
    }

    listenForSubmits(receiveSubmit): void {
        this.socket.on('receive-submit', data => {
            receiveSubmit(data);
        });
    }

    startGame(): void {
        this.socket.emit('start-game');
    }

    pairStudents(chat, groupSize, receivePairs): void {
        this.socket.emit('pair-students', chat, groupSize);
        this.socket.on('send-pairs', (pairs) => {
            receivePairs(pairs);
        });
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */