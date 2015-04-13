/// <reference path="../../typings/node/node.d.ts"/>
var io = require('socket.io');
var ioClient = require('socket.io-client');
var _ = require('lodash');
var domain = require('domain');

var createReadFileStream = require('./fs').readFile;
var createWriteFileStream = require('./fs').writeFile;
var createAppendFileStream = require('./fs').appendFile;
var createMakeDirectoryStream = require('./fs').mkdir;
var createRemoveDirectoryStream = require('./fs').rmdir;
var listAllFilesAndFolders = require('./fs').listAllFilesAndDirs;

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
  'fs.readFile': createReadFileStream,
  'fs.writeFile': createWriteFileStream,
  'fs.appendFile': createAppendFileStream,
  'fs.makeDirectory': createMakeDirectoryStream,
  'fs.removeDirectory': createRemoveDirectoryStream,
  'fs.listRecursive': listAllFilesAndFolders
};

server.on('connection', function(socket){
  socket.on('chain', function(opts){
    var d = domain.create();
    d.on('error', function(err){
      console.log('error while making chain', err);
    })
    d.run(function(){
      var inStream = createInSocketStream(socket, opts.uid);
      var outStream = createOutSocketStream(socket, opts.uid);
      var current = inStream;
      _.each(opts.commands, function(command){
        var stream = commands[command.name](command.opts);
        current = current.pipe(stream);
        if(command.opts.initialData){
          inStream.write(command.opts.initialData);
        }
      });
      current.pipe(outStream);
    })
  })
});

var client = ioClient('http://localhost:8002');

// client.emit('chain', {
//   uid: 'test',
//   commands: [
//     {
//       name: 'fs.readFile',
//       opts: {
//         dir: '/Users/johntan/output04.txt'
//       }
//     },
//   ]
// });

// client.on('test', function(data){
//   console.log("TEST DATA", data);
// });

// client.emit('chain', {
//   uid: 'copy',
//   commands: [
//     {
//       name: 'fs.readFile',
//       opts: {
//         dir: '/Users/johntan/output04.txt'
//       }
//     },
//     {
//       name: 'fs.writeFile',
//       opts: {
//         dir: '/Users/johntan/testout.txt'
//       }
//     },
//   ]
// });

// client.on('copy', function(data){
//   console.log("TEST DATA", data);
// });

// setInterval(function(){
//   client.emit('write', {
//     payload:Math.random().toString()
//   });
// }, 500)

// client.emit('chain', {
//   uid: 'append',
//   commands: [
//     {
//       name: 'fs.appendFile',
//       opts: {
//         dir: '/Users/johntan/testout.txt'
//       }
//     },
//   ]
// });

// setInterval(function(){
//   client.emit('append', {
//     payload:Math.random().toString()
//   });
// }, 500)

// client.emit('chain', {
//   uid: 'mkdir',
//   commands: [
//     {
//       name: 'fs.makeDirectory',
//       opts: {
//         initialData: '/Users/johntan/testdirectorys.tst'
//       }
//     },
//   ]
// });

// client.emit('chain', {
//   uid: 'rmdir',
//   commands: [
//     {
//       name: 'fs.removeDirectory',
//       opts: {
//         initialData: '/Users/johntan/testdirectorys.tst'
//       }
//     },
//   ]
// });


// client.emit('chain', {
//   uid: 'listall',
//   commands: [
//     {
//       name: 'fs.listRecursive',
//       opts: {
//         initialData: '/Users/johntan/code/topsoil/client'
//       }
//     },
//   ]
// });

// client.on('listall', function(data){
//   console.log('returned', data);
// })
