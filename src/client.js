"use strict";
exports.__esModule = true;
exports.Client = void 0;
var ws_1 = require("ws");
var events_1 = require("../events/events");
var readline = require('readline');
var default_url = 'ws://localhost:3000';
var Client = /** @class */ (function () {
    function Client() {
        this.serverOption = 0;
        this.playing = false;
        this.spectating = false;
    }
    Client.prototype.connect = function (ws_url) {
        var _this = this;
        this.client = new ws_1.WebSocket(ws_url || default_url);
        this.client.on('close', function () { return process.exit(); });
        this.client.on('error', function (err) { return console.log(err); });
        this.client.on('message', function (event) { return _this.handleEvents(JSON.parse(event)); });
    };
    Client.prototype.handleEvents = function (event) {
        switch (event.event) {
            case events_1.Events.GAME_UPDATE:
                this.gameUpdate(event);
                break;
            case events_1.Events.PLAYER_CONNECTED:
                this.playerConnected(event);
                break;
            case events_1.Events.GAME_CREATED:
                this.gameCreated(event);
                break;
            case events_1.Events.CLIENT_CONNECTED:
                this.clientConnected(event);
                break;
            case events_1.Events.NAME_NOT_UNIQUE:
                this.nameNotUnique(event);
                break;
            case events_1.Events.GAME_LIMIT_REACHED:
                this.gameLimitReached(event);
                break;
            case events_1.Events.GAME_LIST:
                this.gameList(event);
                break;
            case events_1.Events.SPECTATE_LIST:
                this.spectateList(event);
                break;
            default:
                console.log(event.data.message);
                break;
        }
    };
    Client.prototype.clientConnected = function (event) {
        console.log(event.data.message);
        this.user = {
            name: event.data.name,
            id: event.data.id
        };
        this.showMenu();
    };
    Client.prototype.showMenu = function () {
        var _this = this;
        var reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log("What would you like to do (Enter an option - 1 / 2 / 3) \n 1 - Create a new game \n 2 - Join an existing game \n 3 - spectate");
        reader.question("", function (choice) {
            switch (choice) {
                case '1':
                    var createGameEvent = {
                        event: events_1.Events.CREATE_GAME,
                        data: {
                            creator: _this.user
                        }
                    };
                    _this.client.send(JSON.stringify(createGameEvent));
                    break;
                case '2':
                    var joinGameRequestEvent = {
                        event: events_1.Events.JOIN_GAME_REQUEST,
                        data: {
                            player: _this.user
                        }
                    };
                    _this.client.send(JSON.stringify(joinGameRequestEvent));
                    break;
                case '3':
                    var spectateGameRequestEvent = {
                        event: events_1.Events.SPECTATE_GAME_REQUEST,
                        data: {
                            spectator: _this.user
                        }
                    };
                    _this.client.send(JSON.stringify(spectateGameRequestEvent));
                    break;
            }
            reader.close();
        });
    };
    Client.prototype.nameNotUnique = function (event) {
        console.log(event.data.message);
    };
    Client.prototype.gameLimitReached = function (event) {
        console.log(event.data.message);
    };
    Client.prototype.gameCreated = function (event) {
        console.log(event.data.message);
    };
    Client.prototype.gameList = function (event) {
        var _this = this;
        var games = event.data.games;
        if (games.length > 0) {
            console.log("Available games: ");
            for (var i = 0; i < event.data.games.length; i++) {
                console.log("".concat(i, ")"), event.data.games[i]);
            }
            var reader_1 = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            reader_1.question("Enter the id for the game you would like to join: ", function (answer) {
                if (!games.includes(answer)) {
                    console.log("Please enter a valid game id");
                }
                var joinGameEvent = {
                    event: events_1.Events.JOIN_GAME,
                    data: {
                        game: answer,
                        player: _this.user
                    }
                };
                _this.client.send(JSON.stringify(joinGameEvent));
                reader_1.close();
            });
        }
        else {
            console.log("No games found at the moment.");
            this.showMenu();
        }
    };
    Client.prototype.spectateList = function (event) {
        var _this = this;
        var games = event.data.games;
        if (games.length > 0) {
            console.log("Available games: ");
            for (var i = 0; i < event.data.games.length; i++) {
                console.log("".concat(i, ")"), event.data.games[i]);
            }
            var reader_2 = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            reader_2.question("Enter the id for the game you would like to watch: ", function (answer) {
                if (!games.includes(answer)) {
                    console.log("Please enter a valid game id");
                }
                var spectateGameEvent = {
                    event: events_1.Events.SPECTATE_GAME,
                    data: {
                        game: answer,
                        player: _this.user
                    }
                };
                _this.client.send(JSON.stringify(spectateGameEvent));
                reader_2.close();
            });
        }
        else {
            console.log("No games found at the moment.");
            this.showMenu();
        }
    };
    Client.prototype.gameUpdate = function (event) {
        var _this = this;
        var _a = event.data, game_id = _a.game_id, output = _a.output, turn = _a.turn, draw = _a.draw, win = _a.win, game_end = _a.game_end, bad_position = _a.bad_position;
        console.log(output);
        if (turn === this.user.id && this.playing || bad_position) {
            var reader_3 = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            reader_3.question("Enter a number from 1 to 9: ", function (answer) {
                var updateGameEvent = {
                    event: events_1.Events.UPDATE_GAME,
                    data: {
                        game_id: game_id,
                        cell: parseInt(answer)
                    }
                };
                _this.client.send(JSON.stringify(updateGameEvent));
                reader_3.close();
            });
        }
        else if (!draw && !win && !game_end) {
            console.log("Waiting for a move...");
        }
    };
    Client.prototype.playerConnected = function (event) {
        console.log("Player 2 has connected!");
        this.playing = true;
    };
    Client.prototype.close = function () {
        var playerDisconnectedEvent = {
            event: events_1.Events.PLAYER_DISCONNECTED,
            data: {
                player: this.user
            }
        };
        this.client.send(JSON.stringify(playerDisconnectedEvent));
        process.exit();
    };
    return Client;
}());
exports.Client = Client;
