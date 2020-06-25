/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

class Players {
    constructor() {
        this.players = [];
    }
    
    /** Method that adds a player to the list of players. HostID is the id of the host of the game they are in. */
    addPlayer(hostID, playerID, name, gameData, email) {
        const player = { hostID, playerID, name, gameData, email };
        this.players.push(player);
        return player;
    }
    
    /** Method that removes a player from the list of players. */
    removePlayer(playerID) {
        const player = this.getPlayer(playerID);

        if (player) {
            this.players = this.players.filter((player) => player.playerID !== playerID);
        }
        return player;
    }
    
    /** Method that gets a player based on the given id. */
    getPlayer(playerID) {
        return this.players.filter((player) => player.playerID === playerID)[0]
    }
    
    /** Method that gets all players in one session based on the host's ID of that session. */
    getPlayers(hostID) {
        return this.players.filter((player) => player.hostID === hostID);
    }
}

module.exports = { Players };

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
