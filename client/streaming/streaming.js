var createNewStream = function(options){
  socket, command, opts, cb
  var socket = options.socket;
  var command = options.command;
  var opts = options.opts;
  var cb = options.cb;
  opts.initialData = options.initialData;

  var UID = Math.random().toString(36) + Math.random().toString(36);
  opts._uid = UID;

  socket.emit(command, opts);
  socket.on(UID, cb);
  return {
    emit: function(data){
      socket.emit(UID, data);
    }
  }
};

var createNewChainStream = function(options){

};