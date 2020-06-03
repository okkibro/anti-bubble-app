class Players {
    constructor () {
        this.players = [];
    }
    
    addPlayer(hostID, playerID, name, gameData, email){
        const player = {hostID, playerID, name, gameData, email};
        this.players.push(player);
        return player;
    }
    
    removePlayer(playerID){
        const player = this.getPlayer(playerID);

        if(player){
            this.players = this.players.filter((player) => player.playerID !== playerID);
        }
        return player;
    }
    
    getPlayer(playerID){
        return this.players.filter((player) => player.playerID === playerID)[0]
    }
    
    getPlayers(hostID){
        return this.players.filter((player) => player.hostID === hostID);
    }
}

module.exports = {Players};