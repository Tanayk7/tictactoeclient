import { WebSocket } from 'ws';
import { 
    ClientConnectedEvent, 
    CreateGameEvent, 
    GameCreatedEvent, 
    GameLimitReachedEvent, 
    GameListEvent, 
    GameUpdateEvent, 
    JoinGameRequestEvent, 
    NameNotUniqueEvent, 
    PlayerConnectedEvent, 
    PlayerDisconnectedEvent, 
    SpectateGameRequestEvent,
    SpectateListEvent,
    UpdateGameEvent
} from '../events';
import { Events, baseEvent } from '../events/events';
import { JoinGameEvent } from '../events/join-game-event';
import { SpectateGameEvent } from '../events/spectate-game-event';
import { Player } from '../Game/game';

declare function require(name:string) : any;

const readline = require('readline');
const default_url = 'ws://localhost:3000';

export class Client{
    client!: WebSocket;
    serverOption: number;
    user!: Player;
    playing: boolean;
    spectating: boolean;
    
    constructor(){
        this.serverOption = 0;    
        this.playing = false;
        this.spectating = false;
    }

    connect(ws_url?: string) : void {
        this.client = new WebSocket(ws_url || default_url);

        this.client.on('close', () =>  process.exit());
        this.client.on('error', (err) => console.log(err));
        this.client.on('message', (event: string) =>  this.handleEvents(JSON.parse(event) as baseEvent));
    }

    handleEvents(event: baseEvent) : void {        
        switch(event.event){
            case Events.GAME_UPDATE: 
                this.gameUpdate(event as GameUpdateEvent);
                break;

            case Events.PLAYER_CONNECTED: 
                this.playerConnected(event as PlayerConnectedEvent);
                break;

            case Events.GAME_CREATED: 
                this.gameCreated(event as GameCreatedEvent);
                break;

            case Events.CLIENT_CONNECTED:
                this.clientConnected(event as ClientConnectedEvent)
                break;

            case Events.NAME_NOT_UNIQUE:
                this.nameNotUnique(event as NameNotUniqueEvent);
                break;

            case Events.GAME_LIMIT_REACHED: 
                this.gameLimitReached(event as GameLimitReachedEvent)
                break;

            case Events.GAME_LIST: 
                this.gameList(event as GameListEvent);
                break;

            case Events.SPECTATE_LIST:
                this.spectateList(event as SpectateListEvent);
                break;

            default:    
                console.log(event.data.message);
                break;
        }
    }

    clientConnected(event: ClientConnectedEvent){
        console.log(event.data.message);

        this.user = { 
            name: event.data.name,
            id: event.data.id
        };
        
        this.showMenu();
    }
    
    showMenu(){      
        const reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log(`What would you like to do (Enter an option - 1 / 2 / 3) \n 1 - Create a new game \n 2 - Join an existing game \n 3 - spectate`);
        
        reader.question("", (choice: string) => {
            switch(choice){
                case '1': 
                    const createGameEvent: CreateGameEvent = {
                        event: Events.CREATE_GAME,
                        data: {
                            creator: this.user
                        }
                    }

                    this.client.send(JSON.stringify(createGameEvent));
                    break;

                case '2': 
                    const joinGameRequestEvent: JoinGameRequestEvent = {
                        event: Events.JOIN_GAME_REQUEST,
                        data: {
                            player: this.user
                        }
                    }

                    this.client.send(JSON.stringify(joinGameRequestEvent));
                    break;

                case '3': 
                    const spectateGameRequestEvent: SpectateGameRequestEvent = { 
                        event: Events.SPECTATE_GAME_REQUEST,
                        data: {
                            spectator: this.user
                        }
                    }

                    this.client.send(JSON.stringify(spectateGameRequestEvent));
                    break;
            }

            reader.close();
        })
    }

    nameNotUnique(event: NameNotUniqueEvent){
        console.log(event.data.message);
    }

    gameLimitReached(event: GameLimitReachedEvent){
        console.log(event.data.message);
    }

    gameCreated(event: GameCreatedEvent){
        console.log(event.data.message);
    }

    gameList(event: GameListEvent){
        let { games } = event.data;

        if(games.length > 0){
            console.log(`Available games: `);

            for(let i=0; i < event.data.games.length; i++){
                console.log(`${i})`, event.data.games[i]);
            }
              
            const reader = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
    
            
            reader.question(
                `Enter the id for the game you would like to join: `, 
                (answer: string) => {
                    if(!games.includes(answer)){
                        console.log("Please enter a valid game id");
                    }
    
                    let joinGameEvent: JoinGameEvent = {
                        event: Events.JOIN_GAME,
                        data: {
                            game: answer,
                            player: this.user
                        }
                    }
    
                    this.client.send(JSON.stringify(joinGameEvent));
                    reader.close();
                }
            );
        }
        else{
            console.log("No games found at the moment.");
            this.showMenu();
        }
    }

    spectateList(event: SpectateListEvent){
        let { games } = event.data;

        if(games.length > 0){
            console.log(`Available games: `);

            for(let i=0; i < event.data.games.length; i++){
                console.log(`${i})`, event.data.games[i]);
            }
              
            const reader = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            reader.question(
                `Enter the id for the game you would like to watch: `, 
                (answer: string) => {
                    if(!games.includes(answer)){
                        console.log("Please enter a valid game id");
                    }
    
                    let spectateGameEvent: SpectateGameEvent = {
                        event: Events.SPECTATE_GAME,
                        data: {
                            game: answer,
                            player: this.user
                        }
                    }
    
                    this.client.send(JSON.stringify(spectateGameEvent));
                    reader.close();
                }
            );
        }
        else{
            console.log("No games found at the moment.");
            this.showMenu();
        }
    }

    gameUpdate(event: GameUpdateEvent){
        const { game_id, output, turn, draw, win, game_end, bad_position } = event.data;
        
        console.log(output);
        
        if(turn === this.user.id && this.playing || bad_position){
            const reader = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            reader.question(
                `Enter a number from 1 to 9: `, 
                (answer: string) => {
                    let updateGameEvent: UpdateGameEvent = { 
                        event: Events.UPDATE_GAME,
                        data: {
                            game_id,
                            cell: parseInt(answer),
                        }
                    }
    
                    this.client.send(JSON.stringify(updateGameEvent));
                    reader.close();
                }
            );
        } 
        else if(!draw && !win && !game_end){
            console.log("Waiting for a move...");
        }
    }

    playerConnected(event: PlayerConnectedEvent){
        console.log("Player 2 has connected!");

        this.playing = true;
    }

    close(){
        const playerDisconnectedEvent : PlayerDisconnectedEvent = {
            event: Events.PLAYER_DISCONNECTED,
            data: {
                player: this.user
            }
        }

        this.client.send(JSON.stringify(playerDisconnectedEvent));
        process.exit();
    }
}