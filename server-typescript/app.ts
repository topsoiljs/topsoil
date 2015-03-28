/**
 * Created by Derek on 3/24/15.
 */
/// <reference path="typings/hapi/hapi.d.ts"/>
/// <reference path="./server/processManager.ts"/>

var Hapi = require("hapi");
var processManager = require('./server/processManager');

//import validation = require('./server/Server');
//// Create a server with a host and port
var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8000
});

var io = require('socket.io')(server.listener);

io.on('connection', function(socket){
  console.log("a user is connected");
<<<<<<< HEAD
  socket.on('input', function(data){
    data = String(data);
    console.log(data);
=======
  socket.on('input', function(c){
      var ls = processManager();
      ls.run(c)
          .success(function(data){
              console.log('success', data);
          })
          .error(function(error){
              console.log('error', error);
          });
>>>>>>> add a simple process manager
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

