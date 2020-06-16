class Players {
    constructor () {
        this.players = [];
    }
    
    /** Function that adds a player to the list of players. HostID is the id of the host of the game they are in. */
    addPlayer(hostID, playerID, name, gameData, email){
        const player = {hostID, playerID, name, gameData, email};
        this.players.push(player);
        return player;
    }
    
    /** Function that removes a player from the list of players. */
    removePlayer(playerID){
        const player = this.getPlayer(playerID);

        if(player){
            this.players = this.players.filter((player) => player.playerID !== playerID);
        }
        return player;
    }
    
    /** Function that gets a player based on the given id. */
    getPlayer(playerID){
        return this.players.filter((player) => player.playerID === playerID)[0]
    }
    
    /** Function that gets all players in one session based on the host's ID of that session. */
    getPlayers(hostID){
        return this.players.filter((player) => player.hostID === hostID);
    }
}

module.exports = {Players};