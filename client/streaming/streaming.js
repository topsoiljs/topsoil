var createNewStream = function(socket, command, opts, cb){
  var UID = Math.random().toString(36) + Math.random().toString(36);
  opts._uid = UID;

  socket.emit(command, opts);
  socket.on(opts._uid, cb);

  return {
    emit: function(data){
      socket.emit(opts._uid, data);
    }
  }
}
