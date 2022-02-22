import { Events,baseEvent } from "./events";
import { Player } from '../Game/game';

export interface SpectateGameRequestEvent extends baseEvent{
    event: Events.SPECTATE_GAME_REQUEST;
    data: {
        spectator: Player,
    };
};