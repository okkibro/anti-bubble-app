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

		socket.on('host-join', (gameData) => {
			var pin = Math.floor(100000 + Math.random() * 900000); // Generate pin
			games.addGame(pin, socket.id, false, gameData); // Create a new game object and add it to the games list
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
					gameFound = true;
					if (players.getPlayers(hostId).find(x => x.email == params.player.email) != undefined) {
						console.log(`Player ${params.player.email} already in game ${params.pin}`);
						socket.emit('join-failure');
					} else {
						players.addPlayer(hostId, socket.id, `${params.player.firstName} ${params.player.lastName}`, {}, params.player.email); // Add player to the list of players
						socket.join(params.pin); // Player socket joins game room
						socket.emit('join-succes', games.games[i].gameData); // Return succes is true
						io.to(games.games[i].hostID).emit('update-players', params.player); // Send update to the host so the host's screen gets updated with the player's name
					}
				}
			}
			if (!gameFound) {
				console.log('Invalid Pin');
				socket.emit('join-failure');
			}
		});

		socket.on('message', (message) => {
			console.log(message);
			io.sockets.emit('message', `server: ${message}`);
		});

		socket.on('disconnect', () => {
			socket.emit('remove-listeners');
			var game = games.getGame(socket.id); //Finding game with socket.id
			console.log("disconnect");
			//If a game hosted by that id is found, the socket disconnected is a host
			if (game) {
				games.removeGame(socket.id);//Remove the game from games class
				console.log('Game ended with pin:', game.pin);

				var playersToRemove = players.getPlayers(game.hostID); //Getting all players in the game

				//For each player in the game
				for (var i = 0; i < playersToRemove.length; i++) {
					players.removePlayer(playersToRemove[i].playerID); //Removing each player from player class
				}

				io.in(game.pin).emit('host-disconnect'); //Send player back to 'join' screen
				socket.leave(game.pin); //Socket is leaving room
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
				}
			}
		});

		// Gets called when player or host leaves the session page
		socket.on('leave', () => {
			socket.emit('remove-listeners');
			var game = games.getGame(socket.id); //Finding game with socket.id
			console.log("disconnect");
			//If a game hosted by that id is found, the socket disconnected is a host
			if (game) {
				games.removeGame(socket.id);//Remove the game from games class
				console.log('Game ended with pin:', game.pin);

				var playersToRemove = players.getPlayers(game.hostID); //Getting all players in the game

				//For each player in the game
				for (var i = 0; i < playersToRemove.length; i++) {
					players.removePlayer(playersToRemove[i].playerID); //Removing each player from player class
				}

				io.in(game.pin).emit('host-disconnect'); //Send player back to 'join' screen
				socket.leave(game.pin); //Socket is leaving room
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
				}
			}
		});

		// Listener that will receive a question from the host and send it to all players in the session
		socket.on('send-question', (question) => {
			var game = games.getGame(socket.id); // Get the game that the host hosts
			io.in(game.pin).emit('receive-question', question); // Send question to all players in the session
		});

		socket.on('submit', (data) => {
			io.to(players.getPlayer(socket.id).hostID).emit('receive-submit', data);
		});
	});
}

module.exports = runIO;
