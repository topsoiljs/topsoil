var io = require('socket.io');
var Server = require('socket.io');
var io = new Server(8000);
setInterval(function(){
  io.emit('data', Math.random().toString());
}, 100)
