function FilesystemViewStore() {
  var state = {
    files: [],
    fileData: ''
  };
  var streams = {};

  var methods = {
    listFiles: function(args){
      var dir = args.directory;
      if(!dir || dir.length === 0){
        dir = '/';
      }
      streams['fs.ls'] = createNewStream({
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
      streams['fs.readFile'] = createNewStream({
        command: 'fs.readFile',
        cb: function(data){
          state.fileData = data.data;
          eventBus.emit('filesystem');
        },
        opts: args
      })
    },
    makeDirectory: function(args){
      streams['fs.mkdir'] = createNewStream({
        command: 'fs.mkdir',
        cb: function(){
          eventBus.emit('filesystem');
        },
        opts: args
      })
    },
    removeDirectory: function(args){
      streams['fs.mkdir'] = createNewStream({
        command: 'fs.mkdir',
        cb: function(){
          eventBus.emit('filesystem');
        },
        opts: args
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
