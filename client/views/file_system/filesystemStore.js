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

var fsViewStore = FilesystemViewStore();

magic.registerView({
  name: 'filesystem',
  commands: [
     {
      name: "listFiles",
      description: 'lists files in directory',
      args: ['path'],
      tags: ['show files', 'list files', 'display files', 'ls'],
      categories: ['read'],
      method: fsViewStore["listFiles"]
    },
    {
      name: "hideFiles",
      description: 'hides files in directory view',
      args: ['path'],
      tags: ['hide files', 'remove fileview', "don't display files"],
      categories: ['ui'],
      method: fsViewStore["hideFiles"]
    },
    {
      name: "renderFilesystem",
      description: 'renders fileSystemView',
      args: ['path'],
      tags: ['show filesystem view'],
      categories: ['ui'],
      method: fsViewStore["renderView"]
    },
    {
      name: "readFile",
      description: 'reads specified file',
      args: ['path'],
      tags: ['read file'],
      categories: ['read'],
      method: fsViewStore["readFile"]
    },
    {
      name: "makeDirectory",
      description: 'makes directory at path',
      args: ['path'],
      tags: ['make directory mkdir filesystem'],
      categories: ['read'],
      method: fsViewStore["makeDirectory"]
    },
    {
      name: "removeDirectory",
      description: 'removes directory at path',
      args: ['path'],
      tags: ['remove directory rm filesystem'],
      categories: ['write'],
      method: fsViewStore["removeDirectory"]
    }
    ],
  category: 'filesystem',
  component: FilesystemComponent
});

