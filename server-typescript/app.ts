/// <reference path="typings/hapi/hapi.d.ts"/>
/// <reference path="./server/processManager.ts"/>

var Hapi = require("hapi");
var processManager = require('./server/processManager');
var stateRoutes = require('./server/stateAPI/stateRoutes');
var streaming = require('./server/streaming/streaming');
var createInSocketStream = streaming.createInStream;
var createOutSocketStream = streaming.createOutStream;
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

  var api = processManager();

  function setupAPI(socket){
      for(var namespace in api){
          for(var methodName in api[namespace]){
              socket.on(namespace + '.' + methodName, api[namespace][methodName](socket))
              socket.on(namespace + '.' + methodName, function(opts){
                var inStream = createInSocketStream(socket, opts.uid);
                var outStream = createOutSocketStream(socket, opts.uid);
                var commandStream = api[namespace][methodName](opts);
                inStream.pipe(commandStream).pipe(outStream);
              })
          }
      }
  }
  setupAPI(socket);
});

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
