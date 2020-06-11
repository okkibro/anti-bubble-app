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

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */