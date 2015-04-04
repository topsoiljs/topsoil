var MagicInput = React.createClass({
  getInitialState: function(){
    return {
      args: null,
      currentCommand: null,
      suggestions: []
    }
  },
  handleShortcut: function(e){
    if(e.which === 9){
      e.preventDefault();
    }
  },
  handleInput: function(e){
    var el = document.getElementById('terminal');
    if (e.key === 'Enter') {
      if(!this.state.args && this.state.suggestions[0]){
        this.state.suggestions[0].selected = true;
        el.value = el.value += ' ';
        this.setState({
          args: [],
          currentCommand: this.state.suggestions[0],
          suggestions: this.state.suggestions
        })
      }else{
        var value = el.value;
        args = value.split(' ').slice(1);
        eventBus.emit('master');
        magic.callCommand(this.state.currentCommand, args);
        this.state.currentCommand.selected = false;
        el.value = '';
        this.setState({
          args: null,
          currentCommand: null,
          suggestions: []
        })
      }
    }
  },
  onChange: function(e){
    if(!this.state.args){
      var results = magic.search(e.target.value);
      this.setState({
        suggestions: results
      })
    }
  },
  render: function() {
    var nodes = [
      <div className="input-field col s12">
        <i className="mdi-hardware-keyboard-arrow-right prefix"></i>
        <input type="text" onChange={this.onChange} id="terminal" onKeyUp={this.handleInput}  onKeyDown={this.handleShortcut}/>
      </div>
    ];
    return (
      <div>
        <div className="row">
          {nodes}
        </div>
        <div className="row">
          <MagicSuggestions suggestions={this.state.suggestions}/>
        </div>
      </div>
    );
  }
});
