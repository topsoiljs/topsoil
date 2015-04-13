function FilesystemViewStore() {
  var state = {
    files: [],
    fileData: ''
  };
  var streams = {};
  var socket = io();

  var methods = {
    listFiles: function(args){
      var dir = args.directory;
      if(!dir || dir.length === 0){
        dir = '/';
      }
      streams['fs.ls'] = createNewStream({
        socket: socket,
        command: 'fs.ls',
        cb: function(data){
          state.files = data.data.split('\n');
          eventBus.emit('filesystem');
        },
        opts: args,
        initialData: dir
      })
    },
    hideFiles: function(){
      console.log('hidefiles');
      state.files = [];
      eventBus.emit('filesystem');
    },
    readFile: function(args){
      var path = args.path;
      var UID = Math.random();
      socket.emit('fs.readFile', {
        dir: path,
        uid: UID
      });
      socket.on(UID, function(data){
        state.fileData = data.data;
        eventBus.emit('filesystem');
      })
    },
    makeDirectory: function(args){
      var path = args.path;
      var UID = Math.random();
      socket.emit('fs.mkdir', {
        dir: path,
        uid: UID
      });
      socket.on(UID, function(data){
        if(data.err){
          console.log(data.err);
        }
      })
    },
    removeDirectory: function(args){
      var path = args.path;
      var UID = Math.random();
      socket.emit('fs.rmdir', {
        dir: path,
        uid: UID
      });
      socket.on(UID, function(data){
        if(data.err){
          console.log(data.err);
        }
      })
    },
    renderView: function(){

    },
    getState: function() {
      return state;
    }
  }

  return methods;
}
