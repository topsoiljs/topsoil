window._keys = {
  9: 'TAB',
  40: 'DOWN_ARROW',
  38: 'UP_ARROW',
  13: 'ENTER'
};

function isKey(event){
  var keycode = event.which;
  var result = false;
  for(var i=1;i<arguments.length;i++){
    result = result || window._keys[keycode] === arguments[i]
  }
  return result;
};

var MagicInput = React.createClass({
  getInitialState: function(){
    return {
      args: null,
      currentCommand: null,
      suggestions: [],
      suggestionActive: -1,
      preArgsLength: 0
    }
  },
  handleShortcut: function(e){
    // Tab or down
    if(isKey(e, 'TAB', 'DOWN_ARROW')){
      e.preventDefault();
      this.setState({
        suggestionActive: (this.state.suggestionActive + 1) % this.state.suggestions.length
      });
      // Up
    }else if(isKey(e, 'UP_ARROW')){
      var active = (this.state.suggestionActive - 1) % this.state.suggestions.length;
      if(active < 0){
        active = this.state.suggestions.length-1;
      }
      this.setState({
        suggestionActive: active
      });
    }
  },
  handleInput: function(e){
    var el = document.getElementById('terminal');
    if (isKey(e, 'ENTER')) {
      if(this.state.suggestionActive < 0){
        this.state.suggestionActive = 0;
      }
      if(!this.state.args && this.state.suggestions[this.state.suggestionActive]){
        el.value = el.value += ' ';
        this.state.preArgsLength = el.value.length;
        this.setState({
          args: [],
          currentCommand: this.state.suggestions[this.state.suggestionActive],
          suggestions: this.state.suggestions,
          suggestionActive: this.state.suggestionActive,
          preArgsLength: this.state.preArgsLength
        })
      }else{
        var value = el.value;
        args = value.slice(this.state.preArgsLength).split(' ');
        magic.callCommand(this.state.currentCommand, args);
        this.state.currentCommand.selected = false;
        el.value = '';
        this.setState({
          args: null,
          currentCommand: null,
          suggestions: [],
          suggestionActive: -1,
          preArgsLength: 0
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
        <input autoFocus type="text" onChange={this.onChange} id="terminal" onKeyUp={this.handleInput}  onKeyDown={this.handleShortcut}/>
      </div>
    ];
    return (
      <div>
        <div className="row">
          {nodes}
        </div>
        <div className="row">
          <MagicSuggestions suggestionActive={this.state.suggestionActive} suggestions={this.state.suggestions}/>
        </div>
      </div>
    );
  }
});
