/// <reference path="../../typings/node/node.d.ts"/>

var through = require('through2');
var gulp = require('gulp');
var es = require('event-stream');
var spawn = require('child_process').spawn;

var createOutStream = function(socket, id: string) {
  return through(function(chunk, enc, cb) {
    socket.emit(id, {
      data: chunk.toString('utf8'),
    });
    cb();
  })
};

var createDuplex = function(input, out){
  return es.duplex(input, out);
};

var createInfoSocket = function(socket, id : string){
  return function(data){
    socket.emit(id, data);
  }
};

var createInStream = function(socket, id : string){
  var stream = through(function(chunk, enc, cb){
    cb(null, String(chunk));
  });
  socket.on(id, function(data){
    if(!data.end){
      stream.write(data.payload);
    }else{
      stream.end();
    }
  });
  return stream;
};

interface chunkHandler {
  (chunk : string, enc : string, cb : any) : void
}

var createGenericStream = function(chunkHandler : chunkHandler){
  return through(chunkHandler);
};

var createBufferToStringStream = function(){
  return through.obj(function(chunk, enc, cb){
    cb(null, String(chunk));
  })
};

var createSpawnStream = function(command, args, options, infoHandler){
  options = options || {};
  options.stdio = ['pipe', 'pipe'];
  var outStream = createGenericStream(function(chunk, enc, cb){
    cb(null, chunk);
  });

  var stream = spawn(command, args, options);
  infoHandler({
    pid: stream.pid
  });
  stream.stdin.write(String(chunk));
  stream.stdin.end();
  stream.stdout.on('data', function(d){
    outStream.write(String(d) + '\n');
  });
  cb();
  return createDuplex(spawnThrough, outStream);
});

var createSpawnEndStream = function(command, args, options, parser){
  options = options || {};
  options.stdio = ['pipe', 'pipe'];

  return through(function(chunk, enc, cb){
    console.log('the through function is being called with options', options);
    var stream = spawn(command, args, options);
    var data = '';
    stream.stdin.write(String(chunk));
    stream.stdin.end();
    stream.stdout.on('data', function(d){
      data+=d;
    });
    stream.stdout.on('end', function(){
      if(data === ''){
        data = 'message received';
      }
      console.log('stream ended', data);
      cb(null, parser(String(data)));
    });
  });
};

exports.createOutStream = createOutStream;
exports.createInStream = createInStream;
exports.createGenericStream = createGenericStream;
exports.createBufferToStringStream = createBufferToStringStream;
exports.createSpawnStream = createSpawnStream;
exports.createDuplexStream = createDuplex;
exports.createInfoSocket = createInfoSocket;
exports.createGenericStream = createGenericStream;
exports.createSpawnEndStream = createSpawnEndStream;
