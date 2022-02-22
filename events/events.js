"use strict";
exports.__esModule = true;
exports.Events = void 0;
var Events;
(function (Events) {
    // events from server to clients
    Events["CLIENT_CONNECTED"] = "CLIENT_CONNECTED";
    Events["GAME_UPDATE"] = "GAME_UPDATE";
    Events["SERVER_SHUTDOWN"] = "SERVER_SHUTDOWN";
    Events["GAME_OVER"] = "GAME_OVER";
    Events["GAMES_FULL"] = "GAMES_FULL";
    Events["PLAYER_CONNECTED"] = "PLAYER_CONNECTED";
    Events["GAME_CREATED"] = "GAME_CREATED";
    Events["NAME_NOT_UNIQUE"] = "NAME_NOT_UNIQUE";
    Events["GAME_LIMIT_REACHED"] = "GAME_LIMIT_REACHED";
    Events["GAME_LIST"] = "GAME_LIST";
    Events["SPECTATE_LIST"] = "SPECTATE_LIST";
    // events from clients to server
    Events["UPDATE_GAME"] = "UPDATE_GAME";
    Events["CREATE_GAME"] = "CREATE_GAME";
    Events["SPECTATE_GAME_REQUEST"] = "SPECTATE_GAME_REQUEST";
    Events["SPECTATE_GAME"] = "SPECTATE_GAME";
    Events["JOIN_GAME_REQUEST"] = "JOIN_GAME_REQUEST";
    Events["JOIN_GAME"] = "JOIN_GAME";
    Events["PLAYER_DISCONNECTED"] = "PLAYER_DISCONNECTED";
})(Events = exports.Events || (exports.Events = {}));
