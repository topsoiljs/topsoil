var grepStore = require("../s_grep_store.js");

var FileViewer = React.createClass({

  getInitialState: function() {
    return {lineCount: []};
  },

  componentDidMount: function() {
    var mouseDown = false;

    var inputTextDOM = React.findDOMNode(this.refs.inputText);

    var myCodeMirror = CodeMirror(inputTextDOM, {
      value: "",
      mode:  "javascript",  
      lineNumbers: true
    });

    function escapeRegex(str) {
      var specialChars = ">.^$*+?()[{}]\\|";
      var result = "";

      for(var i = 0; i < str.length; i++) {
        var newChar = str[i];
        if(specialChars.indexOf(str[i]) > -1) {
          newChar = "\\" + newChar;
        }

        result += newChar;
      }

      return result;
    }

    myCodeMirror.on("mousedown", function() {
      mouseDown = true;
    }) 

    myCodeMirror.on("cursorActivity", function(codeMirror) {
      if(mouseDown){
        var selection = codeMirror.getSelection();
        var selectionPosition = codeMirror.listSelections()[0];
        var lineLength = this.state.lineCount[selectionPosition.head.line];
        //I suspect this has bad performance. I could use the raw string to calc much faster.
        var nextChar = codeMirror.getRange(selectionPosition.head, 
                                          {ch: selectionPosition.head.ch + 1, line: selectionPosition.head.line});
  
        //need to add a list of chars to escape.
        
        if(selectionPosition.anchor.ch === 0) {
          console.log("first");
          selection = "^" + selection;
        }
  
        if(selectionPosition.head.ch === lineLength) {
          console.log("last");
          selection = selection + "$";
        }
  
        if(nextChar === " ") {
          console.log("end of word");
          // selection = selection + "\\b"; 
        }
  
        grepStore.changeRegexSelection(selection);
      }
    }.bind(this));

    inputTextDOM.addEventListener("mouseup", function() {
      mouseDown = false;
      grepStore.grep();
    });

    this.setState({myCodeMirror: myCodeMirror})
  },
  componentWillUpdate: function(nextProps, nextState) {
    if(nextProps.activeFile !== this.props.activeFile) {
      this.setState({lineCount: nextProps.file.split("\n").map(function(line) { return line.length })});
      nextState.myCodeMirror.setValue(nextProps.file);  
    }
  },
  render: function() {
    return (<div className="inputText" ref="inputText"></div>)
  }
})

module.exports = FileViewer;