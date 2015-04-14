//To Do:
//Get actual uid randomness

//Gotta do a mouse up to a mouse down

function GrepStore() {
  var state = {dir: "",
               activeFile: "",
               files: [],
               regex: {},
               activeRegex: null,
               results: []};

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
      });
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
        args: ["-nR", regexArg, state.dir],
        dir: state.currentDir,
        uid: UID
      });

      socket.on(UID, function(data){
        var lines = data.data.split("\n");
        //Remove empty last line
        lines.pop();

        //Need to know if it is a dir or file?

        var results = lines.map(function(str) {
          var splitStr = str.split(":");
          var lineNum = splitStr[1];
          var filename = splitStr[0];
          splitStr = splitStr.slice(2);
          return {lineNum: lineNum, line: splitStr.join(""), filename: filename};
        })

        state.results = results;
        eventBus.emit('s_grep');
      })
    },

    _getFiles: function(dir, cb) {
      var UID = Math.random();

      socket.emit('fs.listAllFilesAndDirs', {
        dir: dir,
        uid: UID
      });

      socket.on(UID, function(data){
        cb(data.data);
      });
    },

    _addFiles: function(filesystem) {
      filesystem.files.forEach(function(file) {
        state.files.push(filesystem.pwd + "/" + file);
      });

      var folders = filesystem.folders;

      for(var key in folders) {
        methods._addFiles(folders[key]);
      }
    },

    _setFile: function(filePath) {
      console.log("filePath", filePath);
      var UID = Math.random();

      socket.emit('fs.readFile', {
        dir: filePath,
        uid: UID
      });

      socket.on(UID, function(data){
        console.log("data", data);
        state.activeFile = filePath;
        state.file = data.data;
        eventBus.emit('s_grep');
      });
    },

    setDir: function(args) {
      var path = args.path;

      if(path.indexOf(".") > -1) {
        var splitPath = path.split("/");
        var lastIndex = splitPath.length - 1;

        // state.dir = path
        // state.files.push(path);
        // console.log(state.files[0]);
        // methods._setFile(state.files[0]);

        state.dir = splitPath.slice(0, lastIndex).join("/");
        state.files.push(state.dir + "/" + splitPath[lastIndex]);

        methods._setFile(state.files[0]);

      } else {
        state.dir = path;
        methods._getFiles(path, function(filesystem) {
          methods._addFiles(filesystem);
          methods._setFile(state.files[0]);
        });
      }

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

    var inputTextDOM = React.findDOMNode(this.refs.inputText);

    var myCodeMirror = CodeMirror(inputTextDOM, {
      value: "",
      mode:  "javascript",
      lineNumbers: true
    })

    myCodeMirror.on("cursorActivity", function(codeMirror) {
      var selection = codeMirror.getSelection();
      grepStore.changeRegexSelection(selection);

    }.bind(this))

    inputTextDOM.addEventListener("mouseup", function() {
      grepStore.grep();
    });

    this.setState({myCodeMirror: myCodeMirror})
  },
  componentWillUpdate: function(nextProps, nextState) {
    //Could make this happen only once when it inits the nextState.file?
    if((nextState.activeFile !== this.state.activeFile)) {
      nextState.myCodeMirror.setValue(nextState.file);
    }

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
          <p>
            Current Selection: /{selection}/
          </p>
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
          <div className="inputText" ref="inputText">
          </div>
          <div className="results">
            {
             this.state.results.map(function(result) {
               return (<p>{result.line} <a href="">{result.lineNum}</a></p>)
             })
            }
          </div>
        </div>
      </div>
    );
  }
});


magic.registerView({
  name: 'super grep',
  commands: [
    {
      name: "setDirectory",
      description: "sets the directory for the super grep view",
      args: ['path'],
      tags: ["set dir", "folder", "current dir"],
      categories: ['set'],
      method: grepStore['setDir']
    }
  ],
  category: 'filesystem',
  component: SGrepComponent
});
