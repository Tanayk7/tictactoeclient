import { Events,baseEvent } from "./events";
import { Player } from '../Game/game';

export interface CreateGameEvent extends baseEvent{
    event: Events.CREATE_GAME;
    data: {
        creator: Player,
    };
};