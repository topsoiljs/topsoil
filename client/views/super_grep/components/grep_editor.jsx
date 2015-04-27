var EditableText = require("./editable_text.jsx");
var grepStore = require("../s_grep_store.js");


var SGrepEditor = React.createClass({
  getInitialState: function() {
    return {isContentEditable: false};
  },
  doubleClick: function() {
    this.setState({isContentEditable: true});
  },
  processText: function(text) {

    var splitText;
    if(text) {
      splitText = text.split("");
    } else {
      splitText = [];
    }

    return splitText.map(function(character, ind) {
      return (<span className="regexEditor" id={ind}>{character}</span>);
    });
  },
  changeFunc: function(e) {
    grepStore.changeRegexSelection(e.target.value);
  },
  render: function() {
    return (
      <div>
        <p>
          Current Selection:
        </p>
        <EditableText changeFunc={this.changeFunc} processText={this.processText} text={this.props.regex} />
      </div>

    )
  }
})

module.exports = SGrepEditor;

