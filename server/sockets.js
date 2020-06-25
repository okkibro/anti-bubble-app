/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const { LiveGames } = require('./utils/live-games');
const { Players } = require('./utils/players');
let games = new LiveGames();
let players = new Players();

function runIO(io) {
	io.on('connection', (socket) => {
		socket.on('disconnect', () => {
			console.log('user disconnected');
		});

		socket.on('host-join', (gameData) => {

			// Generate pin.
			let pin = Math.floor(100000 + Math.random() * 900000);

			// Create a new game object and add it to the games list.
			games.addGame(pin, socket.id, false, gameData);

			// Host's socket joins the game room.
			socket.join(pin);
			console.log('Game created with pin:', pin);
			socket.emit('showGamePin', pin);
		});

		socket.on('player-join', (params) => {
			let gameFound = false;

			// Look for a game with the entered pin
			for (let i = 0; i < games.games.length; i++) {
				if (params.pin === games.games[i].pin && games.games[i].gameLive === false) {
					let hostId = games.games[i].hostID;
					gameFound = true;
					if (players.getPlayers(hostId).find(x => x.email === params.player.email) !== undefined) {
						console.log(`Player ${params.player.email} already in game ${params.pin}`);
						socket.emit('join-failure');
					} else {

						// Add player to the list of players.
						players.addPlayer(hostId, socket.id, `${params.player.firstName} ${params.player.lastName}`, {}, params.player.email);

						// Player socket joins game room.
						socket.join(params.pin);

						// Return succes is true.
						socket.emit('join-succes', games.games[i].gameData);

						// Send update to the host so the host's screen gets updated with the player's name.
						io.to(games.games[i].hostID).emit('update-players', params.player);
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

			// Finding game with socket.id.
			let game = games.getGame(socket.id);
			console.log('disconnect');

			// If a game hosted by that id is found, the socket disconnected is a host.
			if (game) {

				// Remove the game from games class.
				games.removeGame(socket.id);
				console.log('Game ended with pin:', game.pin);

				// Getting all players in the game.
				let playersToRemove = players.getPlayers(game.hostID);

				// For each player in the game.
				for (let i = 0; i < playersToRemove.length; i++) {

					// Removing each player from player class.
					players.removePlayer(playersToRemove[i].playerID);
				}

				// Send player back to 'join' screen.
				io.in(game.pin).emit('host-disconnect');

				// Socket is leaving room.
				socket.leave(game.pin);
			} else {

				// No game has been found, so it is a player socket that has disconnected.
				// Getting player with socket.id.
				let player = players.getPlayer(socket.id);

				// If a player has been found with that id.
				if (player) {

					// Gets id of host of the game.
					let hostId = player.hostID;

					// Gets game data with hostId.
					let game = games.getGame(hostId);

					// Gets the pin of the game.
					let pin = game.pin;


					//Removes player from players class.
					players.removePlayer(socket.id);

					// Sends data to host to update screen.
					io.to(hostId).emit('remove-player', player);

					// Player is leaving the room.
					socket.leave(pin);
				}
			}
		});

		// Gets called when player or host leaves the session page.
		socket.on('leave', () => {
			socket.emit('remove-listeners');

			// Finding game with socket.id.
			let game = games.getGame(socket.id);
			console.log('disconnect');


			// If a game hosted by that id is found, the socket disconnected is a host.
			if (game) {

				// Remove the game from games class.
				games.removeGame(socket.id);
				console.log('Game ended with pin:', game.pin);

				// Getting all players in the game.
				let playersToRemove = players.getPlayers(game.hostID);

				//For each player in the game
				for (let i = 0; i < playersToRemove.length; i++) {

					// Removing each player from player class.
					players.removePlayer(playersToRemove[i].playerID);
				}

				// Send player back to 'join' screen.
				io.in(game.pin).emit('host-disconnect');

				// Socket is leaving room.
				socket.leave(game.pin);
			} else {

				// No game has been found, so it is a player socket that has disconnected.
				// Getting player with socket.id.
				let player = players.getPlayer(socket.id);

				// If a player has been found with that id.
				if (player) {

					// Gets id of host of the game.
					let hostId = player.hostID;

					// Gets game data with hostId.
					let game = games.getGame(hostId);

					// Gets the pin of the game.
					let pin = game.pin;

					//Removes player from players class
					players.removePlayer(socket.id);

					// Sends data to host to update screen.
					io.to(hostId).emit('remove-player', player);

					// Player is leaving the room.
					socket.leave(pin);
				}
			}
		});

		// Listener that will receive a question from the host and send it to all players in the session.
		socket.on('send-question', (question) => {

			// Get the game that the host hosts.
			let game = games.getGame(socket.id);

			// Send question to all players in the session.
			io.in(game.pin).emit('receive-question', question);
		});

		socket.on('submit', (data) => {
			let player = players.getPlayer(socket.id);
			io.to(player.hostID).emit('receive-submit', { player: player, message: data });
		});

		socket.on('start-game', () => {
			let game = games.getGame(socket.id);
			game.gameLive = true;
			io.in(game.pin).emit('game-start-redirect');
		});

		// Listener that will divide students into groups.
		socket.on('pair-students', (groups, groupSize, articles) => {
			let pairs = [];
			let articleList = [];
			let leaders = [];
			let sources = [];
			let subjects = []

			// Get all the players in the current game.
			let playersInGame = players.getPlayers(socket.id);

			// Teacher selected create random groups.
			if (groups == null) {

				// Shuffle the player list.
				playersInGame = shuffle(playersInGame);

				// Group players into groups of the given size.
				let pairsIndex = 0;
				let remainderIndex = 0;

				while (playersInGame.length > 0) {
					pairs[pairsIndex] = [];
					articleList[pairsIndex] = [];
					parts = articles.filter(x => x.articlenr === pairsIndex)
					for (let a = 0; a < groupSize; a++) {
						let player = playersInGame.shift();
						pairs[pairsIndex].push(player);
						let article = parts.shift();
						if (article.part === 1) {
							leaders.push(player);
							sources.push(article.source);
							subjects.push(article.subject);
						}
						articleList[pairsIndex].push(article);
					}
					if (remainderIndex < playersInGame.length % groupSize) {
						pairs[pairsIndex].push(playersInGame.shift());
						articleList[pairsIndex].push(parts.shift());
						remainderIndex++;
					}
					pairsIndex++;
				}
			} else {

				// Teacher manually created groups
				for (let i = 0; i < groups.length; i++) {
					pairs[i] = [];
					for (let j = 0; j < groups[i].length; j++) {
						pairs[i].push(playersInGame.find(x => {
							return x.email === groups[i][j].email
						}));
					}
				}
			}
			
			socket.emit('send-pairs', pairs, leaders, sources, subjects);

			for (let i = 0; i < pairs.length; i++) {
				for (let j = 0; j < pairs[i].length; j++) {
					let teamMembers = pairs[i].filter(x => x.email !== pairs[i][j].email);
					let article = articleList[i][j];
					socket.to(pairs[i][j].playerID).emit('receive-team', teamMembers, article, leaders);
				}
			}

			function shuffle(array) {
				let currentIndex = array.length, temporaryValue, randomIndex;

				// While there remain elements to shuffle...
				while (0 !== currentIndex) {

					// Pick a remaining element...
					randomIndex = Math.floor(Math.random() * currentIndex);
					currentIndex -= 1;

					// And swap it with the current element.
					temporaryValue = array[currentIndex];
					array[currentIndex] = array[randomIndex];
					array[randomIndex] = temporaryValue;
				}

				return array;
			}
		});

		// This will make the given player's button active again when the teacher removes their answer.
		socket.on('reactivate-button', (player) => {
			socket.to(player.playerID).emit('reactivate');
		});

		socket.on('finish-game', () => {
			io.in(games.getGame(socket.id).pin).emit('finished-game');
		});
	});
}

module.exports = runIO;

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
