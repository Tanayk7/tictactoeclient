import { Client } from "./client";

let client = new Client();
let args = process.argv.slice(2);
let address = args[1];
let name = args[3];

client.connect(`ws://${address}?name=${name}`);

process.on("SIGINT", () => {
    client.close();
});
process.on("SIGTERM", () => {
    client.close();
});
