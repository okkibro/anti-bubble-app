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
			var pin = Math.floor(100000 + Math.random() * 900000); // Generate pin
			games.addGame(pin, socket.id, false, {}); // Create a new game object and add it to the games list
			socket.join(pin); // Host's socket joins the game room
			console.log('Game created with pin:', pin);
			socket.emit('showGamePin', pin);
		});

		socket.on('player-join', (params) => {
			var gameFound = false;
			// Look for a game with the entered pin
			for (let i = 0; i < games.games.length; i++) {
				if (params.pin == games.games[i].pin) {
					var hostId = games.games[i].hostID;
					players.addPlayer(hostId, socket.id, `${params.player.firstName} ${params.player.lastName}`, {}, params.player.email); // Add player to the list of players
					socket.join(params.pin); // Player socket joins game room
					gameFound = true;
					socket.emit('join-succes', true); // Return succes is true
					io.to(games.games[i].hostID).emit('update-players', params.player); // Send update to the host so the host's screen gets updated with the player's name
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

		// Gets called when player or host leaves the session page
		socket.on('leave', () => {
			var game = games.getGame(socket.id); //Finding game with socket.id
			console.log("disconnect");
			//If a game hosted by that id is found, the socket disconnected is a host
			if (game) {
				games.removeGame(socket.id);//Remove the game from games class
				console.log('Game ended with pin:', game.pin);

				var playersToRemove = players.getPlayers(game.hostID); //Getting all players in the game

				//For each player in the game
				for (var i = 0; i < playersToRemove.length; i++) {
					players.removePlayer(playersToRemove[i].playerId); //Removing each player from player class
				}

				io.in(game.pin).emit('host-disconnect'); //Send player back to 'join' screen
				socket.leave(game.pin); //Socket is leaving room
				socket.emit('after-leave');
			} else {
				//No game has been found, so it is a player socket that has disconnected
				var player = players.getPlayer(socket.id); //Getting player with socket.id
				//If a player has been found with that id
				if (player) {
					var hostId = player.hostID;//Gets id of host of the game
					var game = games.getGame(hostId);//Gets game data with hostId
					var pin = game.pin;//Gets the pin of the game

					players.removePlayer(socket.id);//Removes player from players class
					//var playersInGame = players.getPlayers(hostId);//Gets remaining players in game

					io.to(hostId).emit('remove-player', player);//Sends data to host to update screen
					socket.leave(pin); //Player is leaving the room
					socket.emit('after-leave');

				}
			}
		});
	});
}

module.exports = runIO;
