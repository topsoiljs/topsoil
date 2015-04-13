var through = require('through2');
var gulp = require('gulp');
var es = require('event-stream');
var spawn = require('child_process').spawn;

var createOutStream = function(socket, id : string){
  return through(function(chunk, enc, cb){
    socket.emit(id, {
      data: chunk.toString('utf8'),
    });
    cb();
  })
};

var createInStream = function(socket, id : string){
  var stream = through(function(chunk, enc, cb){
    cb(null, String(chunk));
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
  // var argsArr = Array.prototype.slice.call(arguments);
  // console.log(argsArr);
  options = options || {};
  options.stdio = ['pipe', 'pipe'];

  return through(function(chunk, enc, cb){
    var stream = spawn(command, args, options);
    stream.stdin.write(String(chunk));
    stream.stdin.end();
    stream.stdout.on('data', function(d){
      cb(null, String(d));
    })
  });
}

exports.createOutStream = createOutStream;
exports.createInStream = createInStream;
exports.createGenericStream = createGenericStream;
exports.createBufferToStringStream = createBufferToStringStream;
exports.createSpawnStream = createSpawnStream;
