var through = require('through2');
var gulp = require('gulp');

var createSocketStream = function(socket, id : string){
  return through(function(chunk, enc, cb){
    socket.emit(id, String(chunk));
    cb();
  })
}

var io = require('socket.io');
var ioClient = require('socket.io-client');

var convertToBuffer = function(){
  return through.obj(function(chunk, enc, cb){
    var buffed = new Buffer(chunk._contents);
    cb(null, String(buffed));
  })
};
var server = io(8001);

server.on('connection', function(socket){
  socket.on('newthing', function(data){
    var iostream = createSocketStream(socket, data);
    gulp.src('/Users/johntan/code/streamsPlay/nums.txt')
      .pipe(convertToBuffer())
      .pipe(iostream)
  })
})
var client = ioClient('http://localhost:8001');
var secret = "101";
client.emit('newthing', secret);
client.on(secret, function(data){
  console.log(data);
})
