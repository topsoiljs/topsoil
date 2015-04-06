function ViewStore() {
  var state = {
    files: [],
    fileData: ''
  };
  var socket = io();

  var methods = {
    listFiles: function(args){
      var dir = args.directory;
      var UID = Math.random();
      socket.emit('fs.ls', {
        dir: dir,
        uid: UID
      });
      socket.on(UID, function(data){
        state.files = data.data;
        eventBus.emit('filesystem');
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
        state.fileDate = data.data;
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

var viewStore = ViewStore();

