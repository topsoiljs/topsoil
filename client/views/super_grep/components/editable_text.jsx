var EditableText = React.createClass({
  getInitialState: function() {
    return {isEditing: false};
  },
  setEditable: function() {
    this.setState({isEditing: true});
  },
  unFocus: function() {
    this.setState({isEditing: false});
    grepStore.grep();
  },
  render: function() {
    if(this.state.isEditing) {
      return (
        <div className="regexInput">
          <input onBlur={this.unFocus} onChange={this.props.changeFunc} type="text" value={this.props.text}></input>
        </div>
      )
    } else {
      return (
        <p>
          <span onDoubleClick={this.setEditable}>{this.props.processText(this.props.text)}</span>
        </p>
      )  
    }
    
  }
});