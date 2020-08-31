/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

class LiveGames {
	constructor() {
		this.games = [];
	}

	/**
	 * Method that adds a gane ti tge kust if ganes.
	 * gameLive says whether the game has started or not.
	 * gameData contains the name and options of the game being played.
	 */
	addGame(pin, hostId, gameLive, gameData) {
		const game = {
			pin,
			hostId,
			gameLive,
			gameData
		};
		this.games.push(game);
		return game;
	}

	/**
	 * Method that removes a game from the list of gasmes.
	 */
	removeGame(hostId) {
		const game = this.getGame(hostId);

		if (game) {
			this.games = this.games.filter((game) => game.hostId !== hostId);
		}
		return game;
	}

	/**
	 * Method to get the game given an id.
	 */
	getGame(hostId) {
		return this.games.filter((game) => game.hostId === hostId)[0];
	}
}

module.exports = { LiveGames };
