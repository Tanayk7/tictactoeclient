"use strict";
exports.__esModule = true;
var client_1 = require("./client");
var client = new client_1.Client();
var args = process.argv.slice(2);
var address = args[1];
var name = args[3];
client.connect("ws://".concat(address, "?name=").concat(name));
process.on("SIGINT", function () {
    client.close();
});
process.on("SIGTERM", function () {
    client.close();
});
