import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketIOService {
  socket = io(environment.ENDPOINT);
  constructor() { }

  createSession() {
    this.socket.emit('host-join');
    this.socket.on('players', (players: []) => {
      console.log(players);
    });
  }

  joinSession() {
    this.socket.emit('player-join', {pin: 123456, player: "player 1"});
    this.socket.on('message', (message: string) => {
      console.log(message);
    });
  }

  sendMessage(message) {
    this.socket.emit('message', message)
  }

}
