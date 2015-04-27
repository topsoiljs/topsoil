var createNewStream = require("../../streaming/streaming_client.js").createNewStream;
var eventBus = require("../../eventBus.js");

function FilesystemViewStore() {
  var state = {
    files: [],
    fileData: ''
  };
  var streams = {};

  var methods = {
    listFiles: function(args){
      var dir = args.path;
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
        initialData: args.path
      })
    },
    removeDirectory: function(args){
      streams['fs.mkdir'] = createNewStream({
        command: 'fs.mkdir',
        cb: function(){
          eventBus.emit('filesystem');
        },
        initialData: args.path
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

module.exports = FilesystemViewStore();
