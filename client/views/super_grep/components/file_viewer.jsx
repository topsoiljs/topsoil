var grepStore = require("../s_grep_store.js");

var FileViewer = React.createClass({

  getInitialState: function() {
    return {lineCount: []};
  },
  //To add line jumping functionalityt would probably need to move codemirror thing into the store.
  //Function taken from: http://stackoverflow.com/questions/10575343/codemirror-is-it-possible-to-scroll-to-a-line-so-that-it-is-in-the-middle-of-w
  jumpToLine: function(i) { 
    var t = editor.charCoords({line: i, ch: 0}, "local").top; 
    var middleHeight = editor.getScrollerElement().offsetHeight / 2; 
    editor.scrollTo(null, t - middleHeight - 5); 
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
          selection = "^" + selection;
        }

        if(selectionPosition.head.ch === lineLength) {
          selection = selection + "$";
        }

        if(nextChar === " ") {
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
    return (<div className="ui segment inputText" ref="inputText"></div>)
  }
})

module.exports = FileViewer;
