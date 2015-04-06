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
  },
  render: function() {
    var filesInDir = this.state.files.map(function(filename) {
      return (<li className="collection-item"> {filename} </li>)
    });
    var fileData = this.state.fileData;
    return (<row>
       Filesystem
       <ul className="collection">
         {filesInDir}
       </ul>
       {fileData}
       <a id="show" href="">show files</a>
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
