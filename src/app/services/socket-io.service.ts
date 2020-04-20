import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { DataService } from './data-exchage.service';

@Injectable({
    providedIn: 'root'
})
export class SocketIOService {
    private socket = io(environment.ENDPOINT);
    pin;

    constructor(private data: DataService) { }

    createSession() {
        this.socket.emit('host-join');
        this.socket.on('players', (players: []) => {
            console.log(players);
        });
        this.socket.on('showGamePin', (pin) => {
            this.data.changeMessage(pin);
            this.pin = pin;
            console.log(pin);
        });
        
    }

    joinSession(pin, email) {
        this.socket.emit('player-join', {pin: pin, player: email});
        this.socket.on('message', (message: string) => {
            console.log(message);
        });
    }

    sendMessage(message) {
        this.socket.emit('message', message)
    }
}
