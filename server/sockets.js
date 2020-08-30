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
		socket.on('host-join', (gameData) => {

			// Generate pin.
			let pin = Math.floor(100000 + Math.random() * 900000);

			// Create a new game object and add it to the games list.
			games.addGame(pin, socket.id, false, gameData);

			// Host's socket joins the game room.
			socket.join(pin);
			socket.emit('showGamePin', pin);
		});

		socket.on('player-join', (params) => {
			let gameFound = false;

			// Look for a game with the entered pin
			for (let i = 0; i < games.games.length; i++) {
				if (parseInt(params.pin) === games.games[i].pin && games.games[i].gameLive === false) {
					let hostId = games.games[i].hostId;
					gameFound = true;
					if (players.getPlayers(hostId).find(x => x.email === params.player.email) !== undefined) {
						socket.emit('join-failure');
					} else {

						// Add player to the list of players.
						players.addPlayer(hostId, socket.id, `${params.player.firstName} ${params.player.lastName}`, {}, params.player.email);

						// Player socket joins game room.
						socket.join(parseInt(params.pin));

						// Return succes is true.
						socket.emit('join-succes', games.games[i].gameData);

						// Send update to the host so the host's screen gets updated with the player's name.
						io.to(games.games[i].hostId).emit('update-players', params.player);
					}
				}
			}
			if (!gameFound) {
				socket.emit('join-failure');
			}
		});

		socket.on('message', (message) => {
			socket.emit('message', `server: ${message}`);
		});

		socket.on('disconnect', () => {
			socket.emit('remove-listeners');

			// Finding game with socket.id.
			let game = games.getGame(socket.id);

			// If a game hosted by that id is found, the socket disconnected is a host.
			if (game) {

				// Remove the game from games class.
				games.removeGame(socket.id);

				// Getting all players in the game.
				let playersToRemove = players.getPlayers(game.hostId);

				// For each player in the game.
				for (let i = 0; i < playersToRemove.length; i++) {

					// Removing each player from player class.
					players.removePlayer(playersToRemove[i].playerId);
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
					let hostId = player.hostId;

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

			// If a game hosted by that id is found, the socket disconnected is a host.
			if (game) {

				// Remove the game from games class.
				games.removeGame(socket.id);

				// Getting all players in the game.
				let playersToRemove = players.getPlayers(game.hostId);

				//For each player in the game
				for (let i = 0; i < playersToRemove.length; i++) {

					// Removing each player from player class.
					players.removePlayer(playersToRemove[i].playerId);
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
					let hostId = player.hostId;

					// Gets game data with hostId.
					let game = games.getGame(hostId);

					// Gets the pin of the game.
					let pin = game.pin;

					// Removes player from players class.
					players.removePlayer(socket.id);

					// Sends data to host to update screen.
					io.to(hostId).emit('remove-player', player);

					// Send signal to remaining players in session that player has left.
					io.in(game.pin).emit('player-left', player);

					// Player is leaving the room.
					socket.leave(pin);
				}
			}
		});

		// Listener that will receive a question from the host and send it to all players in the session.
		socket.on('send-question', question => {

			// Get the game that the host hosts.
			let game = games.getGame(socket.id);

			// Send question to all players in the session.
			io.in(game.pin).emit('receive-question', question);
		});

		// Listener that will receive an answer given by a student and send it to the host of the session
		// so it can be seen on the digiboard and to the student so it can be recorded.
		socket.on('submit', answer => {
			let player = players.getPlayer(socket.id);
			io.to(player.playerId).emit('record-answer', answer);
			io.to(player.hostId).emit('receive-submit', { player: player, message: answer });
		});

		// Listener that will set the game that has just started as live so the session can go to the next
		// step and no one can join anymore.
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
			let subjects = [];

			// Get all the players in the current game.
			let game = games.getGame(socket.id);
			let playersInGame = players.getPlayers(game.hostId);

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
					let parts = articles.filter(x => x.articlenr === pairsIndex);
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
							return x.email === groups[i][j].email;
						}));
					}
				}
			}

			socket.emit('send-pairs', pairs, leaders, sources, subjects);

			for (let i = 0; i < pairs.length; i++) {
				for (let j = 0; j < pairs[i].length; j++) {
					let teamMembers = pairs[i].filter(x => x.email !== pairs[i][j].email);
					let article = articleList[i][j];
					socket.to(pairs[i][j].playerId).emit('receive-team', teamMembers, article, leaders);
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
			socket.to(player.playerId).emit('reactivate');
		});

		// This will delete the answer that the host removed from the player's recorded answers.
		socket.on('remove-answer', (player) => {
			socket.to(player.playerId).emit('delete-answer');
		});

		// Listener that will emit the 'finished-game' signal to all players in the session and also
		// how the game ended (time ran out or the host stopped it).
		socket.on('finish-game', (timedOut) => {
			io.in(games.getGame(socket.id).pin).emit('finished-game', timedOut);
		});

		// Listener that gets activated the same time as the 'start-game' listener that emits to all
		// players in the session who else is in the session so this can be recorded.
		socket.on('get-players', () => {
			let game = games.getGame(socket.id);
			let sessionPlayers = players.getPlayers(game.hostId);
			io.in(games.getGame(socket.id).pin).emit('got-players', sessionPlayers);
		});

		// Listener that will emit the 'paused-game' signal to all players in the session.
		socket.on('pause-game', () => {
			io.in(games.getGame(socket.id).pin).emit('paused-game');
		});

		// Listener that will emit the 'resumed-game' signal to all players.
		socket.on('resume-game', () => {
			io.in(games.getGame(socket.id).pin).emit('resumed-game');
		});
	});
}

module.exports = runIO;
