var through = require('through2');
var gulp = require('gulp');
var es = require('event-stream');

var createOutStream = function(socket, id : string){
  return through(function(chunk, enc, cb){
    socket.emit(id, String(chunk));
    cb(null, chunk);
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

// var io = require('socket.io');
// var ioClient = require('socket.io-client');

// var convertToBuffer = function(){
//   return through.obj(function(chunk, enc, cb){
//     var buffed = new Buffer(chunk._contents);
//     cb(null, String(buffed));
//   })
// };
// var server = io(8002);

// server.on('connection', function(socket){
//   socket.on('newthing', function(id){
//     console.log(id);
//     var iostream = createOutStream(socket, id);
//     var instream = createInStream(socket, id);
//     instream
//       .pipe(process.stdout)
//   })
// })
// var client = ioClient('http://localhost:8002');
// var secret = "101";
// client.emit('newthing', secret);
// var end = false;
// setInterval(function(){
//   client.emit(secret, {payload: "random" + Date.now(), end: end});
// }, 500)
// setTimeout(function(){
//   end = true;
// }, 1500)
exports.createOutStream = createOutStream;
exports.createInStream = createInStream;
