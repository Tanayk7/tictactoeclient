import { Events,baseEvent } from "./events";
import { Player } from '../Game/game';

export interface PlayerDisconnectedEvent extends baseEvent{
    event: Events.PLAYER_DISCONNECTED;
    data: {
        player: Player,
    };
};