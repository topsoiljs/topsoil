/**
 * Created by Derek on 3/24/15.
 */
/// <reference path="typings/hapi/hapi.d.ts"/>
var Hapi = require("hapi");
var spawn = require('child_process').spawn;
//import validation = require('./server/Server');
//// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});
var io = require('socket.io')(server.listener);
io.on('connection', function (socket) {
    console.log("a user is connected");
    socket.on('input', function (data) {
        data = String(data);
        console.log(data);
    });
});
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'client'
        }
    }
});
server.start();
