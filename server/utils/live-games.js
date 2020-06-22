/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

class LiveGames {
    constructor () {
        this.games = [];
    }
    
    /** Function that adds a gane ti tge kust if ganes. 
     * gameLive says whether the game has started or not. 
     * gameData contains the name and options of the game being played. */
    addGame(pin, hostID, gameLive, gameData){
        const game = {pin, hostID, gameLive, gameData};
        this.games.push(game);
        return game;
    }
    
    /** Function that removes a game from the list of gasmes. */
    removeGame(hostID){
        const game = this.getGame(hostID);

        if(game){
            this.games = this.games.filter((game) => game.hostID !== hostID);
        }
        return game;
    }
    
    /** Function that gets a game based on the host's ID given. */
    getGame(hostID){
        return this.games.filter((game) => game.hostID === hostID)[0]
    }
}

module.exports = {LiveGames};