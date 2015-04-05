var MagicInput = React.createClass({
  getInitialState: function(){
    return {
      args: null,
      currentCommand: null,
      suggestions: [],
      suggestionActive: -1
    }
  },
  handleShortcut: function(e){
    // Tab or down
    if(e.which === 9 || e.which === 40){
      e.preventDefault();
      this.setState({
        suggestionActive: (this.state.suggestionActive + 1) % this.state.suggestions.length
      });
      // Up
    }else if(e.which === 38){
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
    if (e.key === 'Enter') {
      if(this.state.suggestionActive < 0){
        this.state.suggestionActive = 0;
      }
      if(!this.state.args && this.state.suggestions[this.state.suggestionActive]){
        el.value = el.value += ' ';
        this.setState({
          args: [],
          currentCommand: this.state.suggestions[this.state.suggestionActive],
          suggestions: this.state.suggestions,
          suggestionActive: this.state.suggestionActive
        })
      }else{
        var value = el.value;
        args = value.split(' ').slice(1);
        magic.callCommand(this.state.currentCommand, args);
        this.state.currentCommand.selected = false;
        el.value = '';
        this.setState({
          args: null,
          currentCommand: null,
          suggestions: [],
          suggestionActive: -1
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
    console.log(this.state.suggestionActive);

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
          <MagicSuggestions suggestionActive={this.state.suggestionActive} suggestions={this.state.suggestions}/>
        </div>
      </div>
    );
  }
});
