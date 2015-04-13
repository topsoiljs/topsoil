var FileViewer = React.createClass({
  componentDidMount: function() {
    var inputTextDOM = React.findDOMNode(this.refs.inputText);

    var myCodeMirror = CodeMirror(inputTextDOM, {
      value: "",
      mode:  "javascript",  
      lineNumbers: true
    });

    myCodeMirror.on("cursorActivity", function(codeMirror) {
      var selection = codeMirror.getSelection();
      grepStore.changeRegexSelection(selection);  
    }.bind(this));

    inputTextDOM.addEventListener("mouseup", function() {
      grepStore.grep();
    });

    this.setState({myCodeMirror: myCodeMirror})
  },
  componentWillUpdate: function(nextProps, nextState) {
    if(nextProps.activeFile !== this.props.activeFile) {
      nextState.myCodeMirror.setValue(nextProps.file);  
    }
  },
  render: function() {
    return (<div className="inputText" ref="inputText"></div>);
  }
});