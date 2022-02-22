import { Events,baseEvent } from "./events";
import { Player } from '../Game/game';

export interface JoinGameRequestEvent extends baseEvent{
    event: Events.JOIN_GAME_REQUEST;
    data: {
        player: Player,
    };
};