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

    joinSession(pin, user, callback): any {
        this.socket.emit('player-join', {pin: pin, player: user});
        this.socket.on('message', (message: string) => {
            console.log(message);
        });
        this.socket.on('join-succes', (succes) => {
            this.data.changeMessage(pin);
            callback(succes);
        });
    }

    sendMessage(message) {
        this.socket.emit('message', message);
    }

    getPlayers(callback) {
        this.socket.emit('get-players', this.socket.id);
        this.socket.on('send-players', players => {
            console.log(players);
            callback(players);
        });
    }

    listenForUpdates(callback) {
        this.socket.on('update-players', player => {
            callback(player);
        });
    }
}
