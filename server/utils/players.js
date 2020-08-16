/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

class Players {
	constructor() {
		this.players = [];
	}

	/** Method that adds a player to the list of players. HostId is the id of the host of the game they are in. */
	addPlayer(hostId, playerId, name, gameData, email) {
		const player = { hostId, playerId, name, gameData, email };
		this.players.push(player);
		return player;
	}

	/** Method that removes a player from the list of players. */
	removePlayer(playerId) {
		const player = this.getPlayer(playerId);

		if (player) {
			this.players = this.players.filter((player) => player.playerId !== playerId);
		}
		return player;
	}

	/** Method that gets a player based on the given id. */
	getPlayer(playerId) {
		return this.players.filter((player) => player.playerId === playerId)[0];
	}

	/** Method that gets all players in one session based on the host's Id of that session. */
	getPlayers(hostId) {
		return this.players.filter((player) => player.hostId === hostId);
	}
}

module.exports = { Players };
