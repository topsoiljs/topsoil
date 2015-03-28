/// <reference path="../../typings/hapi/hapi.d.ts"/>
//var Server = require('socket.io');
//var spawn = require('child_process').spawn;

//var io = new Server(8000);
//// setInterval(function(){
////   io.emit('output', Math.random().toString());
//// }, 100)
//
//function emitOutput(data){
//  io.emit('output', String(data));
//};
//
//io.on('connection', function(socket){
//  socket.on('input', function(data){
//    data = String(data);
//    try {
//      var commands = data.split(' ');
//      var command = commands[0];
//      var args = commands.slice(1);
//      args = args.map(function(el){return el});
//      var proc = spawn(command, args);
//
//      proc.on('error', function(err){
//        console.log('invalid command', err);
//        emitOutput('invalid command : ' + data);
//      })
//
//      proc.on('close', function (code) {
//      });
//
//      proc.stdout.on('data', emitOutput);
//
//      proc.stderr.on('data', emitOutput);
//    } catch (e){
//      console.log('error executing');
//      emitOutput('Error executing : ' + e);
//    }
//  })
//})