/// <reference path="./processAPIs/terminal.ts"/>
/// <reference path="./processAPIs/fs.ts"/>
/// <reference path="./processAPIs/git.ts"/>

var streaming = require('./streaming/streaming');
var createInSocketStream = streaming.createInStream;
var createOutSocketStream = streaming.createOutStream;
var createInfoSocketHandler = streaming.createInfoSocket;
var domain = require('domain');
var api = require('./processAPIs');
var _ = require('lodash');
var setupAPI = function setupAPI(socket){
    for(var namespace in api){
        for(var methodName in api[namespace]){
          ((socket, methodName, namespace) => {
            socket.on(namespace + '.' + methodName, function(opts){
              var d = domain.create();
              d.on('error', function(err){
                console.log('error while making chain', err);
              })
              d.run(function(){
                var inStream = createInSocketStream(socket, opts._uid);
                var outStream = createOutSocketStream(socket, opts._uid);
                var infoHandler = createInfoSocketHandler(socket, opts._info_uid);
                var commandStream = api[namespace][methodName](opts, infoHandler);
                inStream.pipe(commandStream).pipe(outStream);
                if(opts.initialData !== undefined){
                  inStream.write(opts.initialData);
                }
              })
            })
          })(socket, methodName, namespace)
        }
    }
    socket.on('chain', function(opts){
      var d = domain.create();
      d.on('error', function(err){
        console.log('error while making chain', err);
      });
      console.log(opts, 'chain incoming');
      d.run(function(){
        var inStream = createInSocketStream(socket, opts._uid);
        var outStream = createOutSocketStream(socket, opts._uid);

        var current = inStream;
        _.each(opts.commands, function(command){
          var splitCommand = command.name.split('.');
          var infoHandler = createInfoSocketHandler(socket, command.opts._info_uid);
          var stream = api[splitCommand[0]][splitCommand[1]](command.opts, infoHandler);
          current = current.pipe(stream);
          if(command.opts.initialData){
            inStream.write(command.opts.initialData);
          }
        });
        current.pipe(outStream);
      })
    })
}

module.exports = function(io){
  io.on('connection', function(socket){
    setupAPI(socket);
  })
}
