const express = require('express');
const mongoose = require('mongoose');
const { LiveGames } = require('./utils/live-games');
const { Players } = require('./utils/players');
var games = new LiveGames();
var players = new Players();

function runIO(io) {
	io.on('connection', (socket) => {
		socket.on('disconnect', () => {
			console.log('user disconnected');
		});

		socket.on('host-join', () => {
			var pin = Math.floor(100000 + Math.random() * 900000);
			games.addGame(pin, socket.id, false, {})
			socket.join(pin);
			console.log('Game created with pin:', pin);
			socket.emit('showGamePin', pin);
		});

		socket.on('player-join', (params) => {
			var gameFound = false;
			for (let i = 0; i < games.games.length; i++) {
				if (params.pin == games.games[i].pin) {
					var hostId = games.games[i].hostID;
					players.addPlayer(hostId, socket.id, `${params.player.firstName} ${params.player.lastName}`, {});
					socket.join(params.pin);
					gameFound = true;
					socket.emit('join-succes', true);
					io.to(games.games[i].hostID).emit('update-players', params.player);
				}
			}
			if (!gameFound) {
				console.log('Invalid Pin');
				socket.emit('join-succes', false);
			}
		});

		socket.on('message', (message) => {
			console.log(message);
			io.sockets.emit('message', `server: ${message}`);
		});
		
		socket.on('get-players', (hostId) => {
			socket.emit('send-players', players.getPlayers(hostId));
		});
	});
}

module.exports = runIO;
