var through = require('through2');
var gulp = require('gulp');
var es = require('event-stream');
var spawn = require('child_process').spawn;

var createOutStream = function(socket, id : string){
  return through(function(chunk, enc, cb){
    socket.emit(id, String(chunk));
    cb();
  })
};

var createInStream = function(socket, id : string){
  var stream = through(function(chunk, enc, cb){
    cb(null, chunk);
  })
  socket.on(id, function(data){
    if(!data.end){
      stream.write(data.payload);
    }else{
      stream.end();
    }
  })
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

var createSpawnStream = function(command, args, options){
  var stream = spawn.apply(null, arguments);
  return es.duplex(stream.stdin, stream.stdout);
}

exports.createOutStream = createOutStream;
exports.createInStream = createInStream;
exports.createGenericStream = createGenericStream;
exports.createBufferToStringStream = createBufferToStringStream;
exports.createSpawnStream = createSpawnStream;
