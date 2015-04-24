  var eventBus = require("../../eventBus.js");
var magic = require("../../magic/magic.js");

var fsViewStore = require("./fs_store.js");

var FilesystemComponent = React.createClass({
  getInitialState: function() {
    return fsViewStore.getState();
  },
  componentDidMount: function() {
    eventBus.register("filesystem", function() {
      this.setState(fsViewStore.getState());
    }.bind(this));

    var inputTextDOM = React.findDOMNode(this.refs.inputText);

    var myCodeMirror = CodeMirror(inputTextDOM, {
      value: "",
      mode:  "javascript",
      lineNumbers: true
    });
    this.setState({myCodeMirror: myCodeMirror})
  },
  componentWillUpdate: function(nextProps, nextState){
    nextState.myCodeMirror.setValue(nextState.fileData);
  },
  render: function() {
    var nodes = [];
    var currentCol = [];
    for(var i=0;i<this.state.files.length;i++){
      currentCol.push(<li className="fs"> {this.state.files[i]} </li>)
    }
    nodes.push(
      <ul className="collection firstLevelFS">
        {currentCol}
      </ul>
    )
    var fileData = this.state.fileData;
    return (
      <div className="ui grid">
       <div className="ui header">Filesystem</div>
       <div className="row">
        <div className="four wide column">
          {nodes}
        </div>
        <div className="twelve wide column">
          <div ref="inputText"></div>
        </div>
       </div>
      </div>
    );
  }
});

magic.registerView({
  name: 'filesystem',
  commands: [
     {
      name: "List Files",
      description: 'lists files in directory',
      args: ['path'],
      tags: ['show files', 'list files', 'display files', 'ls'],
      categories: ['read'],
      method: fsViewStore["listFiles"]
    },
    {
      name: "Hide Files",
      description: 'hides files in directory view',
      args: ['path'],
      tags: ['hide files', 'remove fileview', "don't display files"],
      categories: ['ui'],
      method: fsViewStore["hideFiles"]
    },
    {
      name: "Render Filesystem",
      description: 'renders fileSystemView',
      args: ['path'],
      tags: ['show filesystem view'],
      categories: ['ui'],
      method: fsViewStore["renderView"]
    },
    {
      name: "Read File",
      description: 'reads specified file',
      args: ['path'],
      tags: ['read file'],
      categories: ['read'],
      method: fsViewStore["readFile"]
    },
    {
      name: "Make Directory",
      description: 'makes directory at path',
      args: ['path'],
      tags: ['make directory mkdir filesystem'],
      categories: ['read'],
      method: fsViewStore["makeDirectory"]
    },
    {
      name: "Remove Directory",
      description: 'removes directory at path',
      args: ['path'],
      tags: ['remove directory rm filesystem'],
      categories: ['write'],
      method: fsViewStore["removeDirectory"]
    }
    ],
  category: 'filesystem',
  icon: 'folder-open',
  component: FilesystemComponent
});

