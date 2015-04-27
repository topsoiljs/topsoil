/// <reference path="typings/hapi/hapi.d.ts"/>
/// <reference path="./server/processManager.ts"/>

var Hapi = require("hapi");
var processManager = require('./server/processManager');
var stateRoutes = require('./server/stateAPI/stateRoutes');
var opn = require('opn');
// Global logger
var format = require('bunyan-format')({outputMode: 'short'});
var log = global.log = require('bunyan').createLogger({name: "topsoil", stream: format});
// Global configuration
var nconf = global.nconf = require('nconf')
                .argv().env()
                .file({file: __dirname + '/default_config.json'});

// Create a server with a host and port
var server = new Hapi.Server();
var setupSocketAPI = require('./server/processManager');

server.connection({
    host: 'localhost',
    port: nconf.get('port')
});

var io = require('socket.io')(server.listener);

setupSocketAPI(io);

stateRoutes(server);

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: __dirname + '/client'
        }
    }
});

server.start();

log.info('started server on port: ' + nconf.get('port'));
if(!nconf.get('noop')){
    log.info('opening browser to ' + 'http://localhost:' + nconf.get('port'));
    opn('http://localhost:' + nconf.get('port'));
}
