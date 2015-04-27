var EditableText = require("./editable_text.jsx");
var grepStore = require("../s_grep_store.js");


var SGrepEditor = React.createClass({
  getInitialState: function() {
    return {isContentEditable: false};
  },
  doubleClick: function() {
    this.setState({isContentEditable: true});
  },
  render: function() {
    return (
      <div>
        <span className="bold unselectable">Current Selection:</span>
        <EditableText activeCharIndex={this.props.activeCharIndex} shouldDisplayOptions={this.props.shouldDisplayOptions} changeFunc={this.changeFunc} text={this.props.regex} />
      </div>
    )
  }
})

module.exports = SGrepEditor;

