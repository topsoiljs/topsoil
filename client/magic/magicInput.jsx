// Temp setstate
// Crazy things happening here. Refactor later.
var currentSuggestions;

eventBus.register('suggestions', function(data){
  currentSuggestions = data;
});
var MagicInput = React.createClass({
  getInitialState: function(){
    return {
      args: null,
      currentCommand: null
    }
  },
  handleInput: function(e){
    var el = document.getElementById('terminal');
    if (e.key === 'Enter') {
      if(!this.state.args && currentSuggestions[0]){
        el.value = el.value += ' ';
        this.setState({
          args: [],
          currentCommand: currentSuggestions[0]
        })
        eventBus.emit('suggestions', []);
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
      eventBus.emit('suggestions', results);
    }
  },
  render: function() {
    var nodes = [<input onChange={this.onChange} id="terminal" onKeyUp={this.handleInput}/>];
    if(this.state.args){
      nodes.push(
        <h3>Enter args for command : {this.state.currentCommand.name}</h3>
      )
    }
    return (
      <div>
        {nodes}
      </div>
    );
  }
});
