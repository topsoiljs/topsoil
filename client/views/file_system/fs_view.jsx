var fsViewStore = FilesystemViewStore();

var FilesystemComponent = React.createClass({
  getInitialState: function() {
    return fsViewStore.getState();
  },
  componentDidMount: function() {
    eventBus.register("filesystem", function() {
      this.setState(fsViewStore.getState());
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
      method: fsViewStore["listFiles"]
    },
    {
      name: "hideFiles",
      description: 'hides files in directory view',
      args: ['directory'],
      tags: ['hide files', 'remove fileview', "don't display files"],
      categories: ['ui'],
      method: fsViewStore["hideFiles"]
    },
    {
      name: "renderFilesystem",
      description: 'renders fileSystemView',
      args: ['directory'],
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
