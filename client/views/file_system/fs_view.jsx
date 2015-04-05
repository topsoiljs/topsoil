function ViewStore() {
  var state = {files: []};
  var socket = io();

  var methods = {
    getFiles: function(args){
          var dir = args.directory;
          var UID = Math.random();
          socket.emit('fs.ls', {
            dir: dir,
            uid: UID
          });
          socket.on(UID, function(data){
            //data.err
            //data.data
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
        dir: dir,
        uid: UID
      });
      socket.on(UID, function(data){
        state = {
          files: [],
          fileData: data.data
        };
        eventBus.emit('filesystem');
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

var FilesystemComponent = React.createClass({
  getInitialState: function() {
    return viewStore.getState();
  },
  componentDidMount: function() {
    eventBus.register("filesystem", function() {
      console.log(this);
      this.setState(viewStore.getState());
    }.bind(this));

    document.getElementById("show").onclick = function(e) {
      e.preventDefault();
      viewStore.getFiles();
    }
    console.log("mounted");
  },
  render: function() {
    console.log("FS render");
    var fileText = this.state.files.map(function(filename) {
      return (<p> {filename} </p>)
    });

    return (<div>
       Filesystem
       {fileText}
       <a id="show" href="">show files</a>
    </div>);
  }
});


magic.registerView({
  name: 'filesystem',
  commands: [
     {
      name: "listFiles",
      description: 'lists files in directory',
      args: ['directory'],
      tags: ['show files', 'list files', 'display files'],
      categories: ['read'],
      method: viewStore["listFiles"]
    },
    {
      name: "hideFiles",
      description: 'hides files in directory view',
      args: ['directory'],
      tags: ['hide files', 'remove fileview', "don't display files"],
      categories: ['ui'],
      method: viewStore["hideFiles"]
    },
    {
      name: "renderFilesystem",
      description: 'renders fileSystemView',
      args: ['directory'],
      tags: ['show filesystem view'],
      categories: ['ui'],
      method: viewStore["renderView"]
    },
    {
      name: "readFile",
      description: 'reads specified file',
      args: ['path'],
      tags: ['read file'],
      categories: ['read'],
      method: viewStore["readFile"]
    }
    ],
  category: 'filesystem',
  component: FilesystemComponent
});

