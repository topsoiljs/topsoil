window._globalSocket = io();

var createNewStream = function(options){
  var command = options.command;
  var opts = options.opts;
  var cb = options.cb;
  opts.initialData = options.initialData;

  var UID = Math.random().toString(36) + Math.random().toString(36);
  opts._uid = UID;

  window._globalSocket.emit(command, opts);
  window._globalSocket.on(UID, cb);
  return {
    emit: function(data){
      window._globalSocket.emit(UID, data);
    }
  }
};
