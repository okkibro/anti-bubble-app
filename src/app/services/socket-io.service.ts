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

    joinSession(pin, user, join, backToHome): any {
        this.hostDisconnected = false;
        this.socket.emit('player-join', {pin: pin, player: user});
        this.socket.on('message', (message: string) => {
            console.log(message);
        });
        this.socket.on('join-succes', (succes) => {
            this.data.changeMessage(pin);
            join(succes);
        });
        this.socket.on('host-disconnect', () => {
            this.hostDisconnected = true;
            this.socket.removeAllListeners();
            backToHome();
        });
    }

    sendMessage(message) {
        this.socket.emit('message', message);
    }

    getPlayers(callback) {
        this.socket.emit('get-players', this.socket.id);
        this.socket.on('send-players', players => {
            callback(players);
        });
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
