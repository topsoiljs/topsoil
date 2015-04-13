function ViewStore() {
  var state = {files: []};
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
      state.files = [];
      eventBus.emit('filesystem');
    },
    readFile: function(args){
      var path = args.path;
      var UID = Math.random();
      state.fileData = '';
      eventBus.emit('filesystem');
      socket.emit('fs.readFile', {
        dir: path,
        uid: UID
      });
      socket.on(UID, function(data){
        console.log(data, 'received');
        state = {
          files: [],
          fileData: state.fileData += data.data
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
      this.setState(viewStore.getState());
    }.bind(this));
  },
  render: function() {
    var nodes = [];
    var currentCol = [];
    for(var i=0;i<this.state.files.length;i++){
      if(i % 15 === 0){
        nodes.push(
          <div className="col">
            <ul className="collection">
              {currentCol}
            </ul>
          </div>
          )
        currentCol = [];
      }else{
        currentCol.push(<li className="collection-item"> {this.state.files[i]} </li>)
      }
    }
    if(currentCol.length > 0){
      nodes.push(
        <div className="col">
          <ul className="collection">
            {currentCol}
          </ul>
        </div>
        )
    }

    var fileData = this.state.fileData;
    return (<row>
       <h4>Filesystem</h4>
       <row>
        {nodes}
       </row>
       {fileData}
    </row>);
  }
});

magic.registerView({
  name: 'filesystem',
  commands: [
     {
      name: "listFiles",
      description: 'lists files in directory',
      args: ['directory'],
      tags: ['show files', 'list files', 'display files', 'ls'],
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
    },
    {
      name: "makeDirectory",
      description: 'makes directory at path',
      args: ['path'],
      tags: ['make directory mkdir filesystem'],
      categories: ['read'],
      method: viewStore["makeDirectory"]
    },
    {
      name: "removeDirectory",
      description: 'removes directory at path',
      args: ['path'],
      tags: ['remove directory rm filesystem'],
      categories: ['write'],
      method: viewStore["removeDirectory"]
    }
    ],
  category: 'filesystem',
  component: FilesystemComponent
});
