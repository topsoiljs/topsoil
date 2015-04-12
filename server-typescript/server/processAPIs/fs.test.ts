/// <reference path="../../typings/node/node.d.ts"/>
var io = require('socket.io');
var ioClient = require('socket.io-client');
var _ = require('lodash');

var createReadFileStream = require('./fs').readFile;

var streaming = require('../streaming/streaming');
var createGenericStreamFunc = streaming.createGenericStream;
var createInSocketStream = streaming.createInStream;
var createOutSocketStream = streaming.createOutStream;

var server = io(8002);
// socket.emit('chain', {
//   uid: 'test',
//   commands: [
//     {
//       name: 'fs.readFile',
//       opts: {
//         dir: '/Users/johntan/test.txt'
//       }
//     },
//     {
//       name: 'tm.grep',
//       opts: {
//         terms: 'test'
//       }
//     }]
// })

var commands = {
  'fs.readFile': createReadFileStream
};

server.on('connection', function(socket){
  socket.on('chain', function(opts){
    var inStream = createInSocketStream(socket, opts.uid);
    var outStream = createOutSocketStream(socket, opts.uid);
    var current = inStream;
    _.each(opts.commands, function(command){
      var stream = commands[command.name](command.opts);
      current = current.pipe(stream);
    });
    current.pipe(outStream);
  })
});

var client = ioClient('http://localhost:8002');

client.emit('chain', {
  uid: 'test',
  commands: [
    {
      name: 'fs.readFile',
      opts: {
        dir: '/Users/johntan/output04.txt'
      }
    },
  ]
});

client.on('test', function(data){
  console.log("TEST DATA", data);
});
