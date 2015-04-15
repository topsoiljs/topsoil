/// <reference path="../../typings/node/node.d.ts"/>
var repl = require('repl');
var streaming = require('../streaming/streaming');
var createGenericStreamFunc = streaming.createGenericStream;
var createSpawnStreamFunc = streaming.createSpawnStream;
var createOutSocket = streaming.createOutStream;
var createInSocket = streaming.createInStream;

var server = require('socket.io')(8001);
server.on('connection', function(socket){
  var socketIn = createInSocket(socket, 'repl');
  var socketOut = createOutSocket(socket, 'repl');
})


var client = require('socket.io-client')(8001);
