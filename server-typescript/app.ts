/// <reference path="typings/hapi/hapi.d.ts"/>
/// <reference path="./server/processManager.ts"/>

var Hapi = require("hapi");
var processManager = require('./server/processManager');
var stateRoutes = require('./server/stateAPI/stateRoutes');
//// Create a server with a host and port
var server = new Hapi.Server();
var setupSocketAPI = require('./server/processManager');

server.connection({
    host: 'localhost',
    port: 8001
});

var io = require('socket.io')(server.listener);


setupSocketAPI(io);
stateRoutes(server);

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
