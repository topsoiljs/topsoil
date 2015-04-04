var MagicInput = React.createClass({
  getInitialState: function(){
    return {
      args: null,
      currentCommand: null,
      suggestions: []
    }
  },
  handleInput: function(e){
    var el = document.getElementById('terminal');
    if (e.key === 'Enter') {
      if(!this.state.args && this.state.suggestions[0]){
        el.value = el.value += ' ';
        this.setState({
          args: [],
          currentCommand: this.state.suggestions[0]
        })
      }else{
        var value = el.value;
        args = value.split(' ').slice(1);
        eventBus.emit('master');
        magic.callCommand(this.state.currentCommand, args);
        el.value = '';
        this.setState({
          args: null,
          currentCommand: null
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
      <div className="input-field col s10">
        <i className="mdi-hardware-keyboard-arrow-right prefix"></i>
        <input type="text" onChange={this.onChange} id="terminal" onKeyUp={this.handleInput}/>
      </div>
    ];
    if(this.state.args){
      nodes.push(
        <h3>Enter args for command : {this.state.currentCommand.name}</h3>
      )
    }
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
