/// <reference path="../../typings/node/node.d.ts"/>
var repl = require('repl');
var streaming = require('../streaming/streaming');
var createGenericStreamFunc = streaming.createGenericStream;
var createSpawnStreamFunc = streaming.createSpawnStream;
var createOutSocket = streaming.createOutStream;
var createInSocket = streaming.createInStream;
var createDuplexStream = streaming.createDuplexStream
var replAPI = <any> {};

replAPI.start = function(options){
  var inStream = createGenericStreamFunc(function(chunk, enc, cb){
    cb(null, String(chunk));
  })
  var outStream = createGenericStreamFunc(function(chunk, enc, cb){
    cb(null, chunk);
  })
  options.input = inStream;
  options.output = process.stdout;
  repl.start(options);
  return createDuplexStream(inStream, outStream);
}

// var server = require('socket.io')(8001);
// server.on('connection', function(socket){
//   var stream;
//   socket.on('startrepl', function(opts){
//     opts = opts || {};
//     var inStream = createInSocket(socket, 'repl');
//     var outStream = createInSocket(socket, 'repl');
//     stream = replAPI.start(opts)
//     inStream.pipe(stream).pipe(outStream);
//   })
// })


// var client = require('socket.io-client')('http://localhost:8001');

// client.emit('startrepl', {})

// client.emit('repl', {payload:'console.log("test")\n'})

// client.on('repl', function(d){
//   process.stdout.write(d.data);
// })

// process.stdin.on('data', function(d){
//   client.emit('repl', {payload: String(d)})
// })



module.exports = replAPI;
