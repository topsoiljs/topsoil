var through = require('through2');

var createSocketStream = function(socket, id : string){
  return through(function(chunk, enc, cb){
    socket.emit(id, String(chunk));
    cb();
  })
}
