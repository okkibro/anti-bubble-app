class LiveGames {
    constructor() {
        this.games = [];
    }

    addGame(pin, hostID, gameLive, gameData) {
        const game = { pin, hostID, gameLive, gameData };
        this.games.push(game);
        return game;
    }

    removeGame(hostID) {
        const game = this.getGame(hostID);

        if (game) {
            this.games = this.games.filter((game) => game.hostID !== hostID);
        }
        return game;
    }

    getGame(hostID) {
        return this.games.filter((game) => game.hostID === hostID)[0]
    }
}

module.exports = { LiveGames };

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */