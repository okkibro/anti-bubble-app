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
    hostDisconnected: boolean;

    constructor(private data: DataService) { }

    // Gets called when a teacher creates a new session
    createSession() {
        this.socket.emit('host-join');
        this.socket.on('players', (players: []) => {
            console.log(0,players);
        });
        this.socket.on('showGamePin', (pin) => {
            this.data.changeMessage(pin);
            this.pin = pin;
        });        
    }

    // Gets called when a user enters a pin and presses the join session button
    joinSession(pin, user, join, backToHome) {
        this.hostDisconnected = false;
        this.socket.emit('player-join', {pin: pin, player: user});
        this.socket.on('message', (message: string) => {
            console.log(message);
        });
        this.socket.on('join-succes', (succes) => {
            this.data.changeMessage(pin);
            join(succes); // After player-join return succes to the angular component
        });
        this.socket.on('host-disconnect', () => {
            this.hostDisconnected = true;
            this.socket.removeAllListeners();
            backToHome(); // When the host disconnects, call the function that sends the player back to the home screen
        });
    }

    sendMessage(message) {
        this.socket.emit('message', message);
    }

    listenForUpdates(addPlayer, removePlayer) {
        this.socket.on('update-players', player => {
            addPlayer(player);
        });
        this.socket.on('remove-player', player => {
            removePlayer(player);
        });
    }

    leaveSession() {
        this.socket.emit('leave');
        this.socket.on('after-leave', () => {
            this.socket.removeAllListeners();
        });
    }
}
