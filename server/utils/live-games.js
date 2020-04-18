class LiveGames {
    constructor () {
        this.games = [];
    }
    
    addGame(pin, hostID, gameLive, gameData){
        const game = {pin, hostID, gameLive, gameData};
        this.games.push(game);
        return game;
    }
    
    removeGame(hostID){
        const game = this.getGame(hostID);

        if(game){
            this.games = this.games.filter((game) => game.hostID !== hostID);
        }
        return game;
    }
    
    getGame(hostID){
        return this.games.filter((game) => game.hostID === hostID)[0]
    }
}

module.exports = {LiveGames};