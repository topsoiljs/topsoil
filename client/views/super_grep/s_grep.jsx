
var grepStore = require("./s_grep_store.js");
var eventBus = require("../../eventBus.js");
var magic = require("../../magic/magic.js");
var FileViewer = require("./components/file_viewer.jsx");
var GrepResults = require("./components/grep_results.jsx");
var SGrepEditor = require("./components/grep_editor.jsx");
//To Do:
//Get actual uid randomness

//Gotta do a mouse up to a mouse down

function GrepStore() {
  var state = {file: "", 
               regex: {},
               activeRegex: null,
               gotFile: false,
               results: [],
               currentDir: "No current Dir Set. Please type 'open file' into the magic bar",
               openFile: "No open file set."};

  var socket = io();

  //Would need to be on a db somewhere.
  //Or a write to file.
  var regexNameCount = 0;

  function newRegex(selection) {
    regexNameCount++

    return {name: "regex" + regexNameCount, 
            selection: selection};
  }

  var methods = {
    openFile: function(args){
      var path = args.path;
      var UID = Math.random();
      
      var pathArr = path.split("/");
      state.openFile = pathArr[pathArr.length - 1];
      pathArr.pop()
      state.currentDir = pathArr.join("/");

      socket.emit('fs.readFile', {
        dir: path,
        uid: UID
      });

      socket.on(UID, function(data){
        state.file = data.data;
        eventBus.emit('s_grep');
      })
    },

    changeRegexSelection: function(newSelection) {
      if(!state.activeRegex) {
        var nRegex = newRegex(newSelection);

        state.regex[nRegex.name] = nRegex;

        state.activeRegex = nRegex.name;
      } else {
        state.regex[state.activeRegex].selection = newSelection;
      }

      eventBus.emit('s_grep');
    },

    getFile: function() {
      state.gotFile = true;

      eventBus.emit('s_grep');
    },

    grep: function() {

      //Specify directory to grep it recursively
      //Specify file to grep it.
      //When a dir is specified which file is displayed?
      //Could list out all of the files in the dir... and click to open one as an example..

      //How should the user ignore files?

      var UID = Math.random();
      var regexArg = state.regex[state.activeRegex].selection; 
      socket.emit('terminal.run', {
        cmd: 'grep',
        args: ["-n", regexArg, state.openFile],
        dir: state.currentDir,
        uid: UID
      });

      socket.on(UID, function(data){
        var lines = data.data.split("\n");
        //Remove empty last line
        lines.pop();

        var results = lines.map(function(str) {
          var splitStr = str.split(":");
          var lineNum = splitStr[0];
          splitStr.shift();
          return {lineNum: lineNum, line: splitStr.join("")};
        })

        state.results = results;
        eventBus.emit('s_grep');
      })
    },

    getFiles: function() {
      var UID = Math.random();
      console.log("getFiles");
      socket.emit('fs.listAllFilesAndDirs', {
        dir: state.currentDir,
        uid: UID
      });

      socket.on(UID, function(data){
      
        console.log(data);
      })
    },

    setDir: function(args) {
      state.currentDir = args.dir;
      methods.getFiles();
      eventBus.emit('s_grep');      
    },

    getState: function() {
      return state;
    }
  }

  return methods;
}

var grepStore = GrepStore();

var SGrepComponent = React.createClass({
  getInitialState: function() {
    return grepStore.getState();
  },
  selectCallback: function(e) {
    //Should probs have a open file component.
    grepStore._setFile(e.target.value);
  },
  componentDidMount: function() {
    eventBus.register("s_grep", function() {
      this.setState(grepStore.getState());
    }.bind(this));
  },
  render: function() {
    var activeRegexName = this.state.activeRegex;
    var activeRegex = this.state.regex[activeRegexName];
    var selection;

    if(activeRegex) {
      selection = activeRegex.selection;
    }

    return (
      <div>
        SUPER GREP
        <div className="row">
          <SGrepEditor regex={selection}/>
          <p>
            Current Directory: {this.state.dir}
          </p>
          <select onChange={this.selectCallback} className="browser-default">
            {
              this.state.files.map(function(file) {
                return (<option value={file}>{file}</option>);
              })
            }
          </select>
          <FileViewer activeFile={this.state.activeFile} file={this.state.file}/>
          <GrepResults results={this.state.results}/>
        </div>
      </div>
    );
  }
});


magic.registerView({
  name: 'super grep',
  commands: [
    {
      name: "Set Directory",
      description: "sets the directory for the super grep view",
      args: ['path'],
      tags: ["set dir", "folder", "current dir", "grep"],
      categories: ['set'],
      method: grepStore['setDir']
    }
  ],
  category: 'filesystem',
  icon: 'file-text-o',
  component: SGrepComponent
});
