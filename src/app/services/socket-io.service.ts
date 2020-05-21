import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { DataService } from './data-exchage.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketIOService {
    private socket = io(environment.ENDPOINT);
    pin;
    players = [];

    constructor(private data: DataService) { }

    createSession() {
        this.socket.emit('host-join');
        this.socket.on('players', (players: []) => {
            console.log(0,players);
        });
        this.socket.on('showGamePin', (pin) => {
            this.data.changeMessage(pin);
            this.pin = pin;
            console.log(1,pin);
        });
        
    }

    joinSession(pin, email, callback): any {
        this.socket.emit('player-join', {pin: pin, player: email});
        this.socket.on('message', (message: string) => {
            console.log(message);
        });
        this.socket.on('join-succes', (succes) => {
            this.data.changeMessage(pin);
            if (succes) {
                this.players.push(email);
            }
            callback(succes);
        });
    }

    sendMessage(message) {
        this.socket.emit('message', message);
    }
}
