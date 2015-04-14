/// <reference path="typings/hapi/hapi.d.ts"/>
/// <reference path="./server/processManager.ts"/>

var Hapi = require("hapi");
var processManager = require('./server/processManager');
var stateRoutes = require('./server/stateAPI/stateRoutes');
var streaming = require('./server/streaming/streaming');
var createInSocketStream = streaming.createInStream;
var createOutSocketStream = streaming.createOutStream;
var domain = require('domain');
//import validation = require('./server/Server');
//// Create a server with a host and port
var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8001
});

var io = require('socket.io')(server.listener);

io.on('connection', function(socket){
  console.log("a user is connected");

  var api = processManager();

  function setupAPI(socket){
      for(var namespace in api){
          for(var methodName in api[namespace]){
            ((socket, methodName, namespace) => {
              socket.on(namespace + '.' + methodName, function(opts){
                var inStream = createInSocketStream(socket, opts._uid);
                var outStream = createOutSocketStream(socket, opts._uid);
                var commandStream = api[namespace][methodName](opts);
                inStream.pipe(commandStream).pipe(outStream);
                if(opts.initialData){
                  inStream.write(opts.initialData);
                }
              })
            })(socket, methodName, namespace)
          }
      }
      socket.on('chain', function(opts){
        var d = domain.create();
        d.on('error', function(err){
          console.log('error while making chain', err);
        })
        d.run(function(){
          var inStream = createInSocketStream(socket, opts._uid);
          var outStream = createOutSocketStream(socket, opts._uid);
          var current = inStream;
          _.each(opts.commands, function(command){
            var splitCommand = command.name.split('.');
            var stream = api[splitCommand[0]][splitCommand[1]](command.opts);
            current = current.pipe(stream);
            if(command.opts.initialData){
              inStream.write(command.opts.initialData);
            }
          });
          current.pipe(outStream);
        })
      })
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
