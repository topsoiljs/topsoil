var createNewStream = require("../../streaming/streaming_client.js").createNewStream
var eventBus = require("../../eventBus.js");

function GrepStore() {
  var state = {dir: "",
               activeFile: "",
               files: [],
               regex: {},
               activeRegex: null,
               results: []};

  var streams = {};

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

      if(state.regex[state.activeRegex] && state.regex[state.activeRegex].selection) {
        var regexArg = state.regex[state.activeRegex].selection;

        function grepCallback(data){
          console.log("grepCallback", data);
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
        }

        streams['terminal.callCommand'] = createNewStream({
          command: 'terminal.callCommand',
          cb: grepCallback,
          opts: {
            opts: {cwd: state.dir},
            cmd: "grep",
            args: ["-nR", regexArg, state.dir]
          },
          initialData: " "
        });
      }
    },

    _getFiles: function(dir, cb) {
      var stream = createNewStream({
        command: 'fs.listAllFilesAndDirs',
        cb: function(data) {
          cb(JSON.parse(data.data));
        },
        //For some reason this does not work for "" it needs a space.
        initialData: " ",
        opts: {cwd: dir}
      });
    },

    _addFiles: function(filesystem, pwd) {
      filesystem.files.forEach(function(file) {
        state.files.push(pwd + "/" + file);
      });

      var folders = filesystem.folders;

      for(var key in folders) {
        methods._addFiles(folders[key], pwd + "/" + key);
      }
    },

    _setFile: function(filePath) {
      createNewStream({
        command: 'fs.readFile',
        cb: function(data) {
          state.activeFile = filePath;
          state.file = data.data;
          eventBus.emit('s_grep');
        },
        opts: {path: filePath}
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
          console.log("fs", filesystem);
          methods._addFiles(filesystem, state.dir);
          // methods._setFile(state.files[0]);
          eventBus.emit('s_grep');
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

module.exports = GrepStore();
