var MagicSuggestions = require("./magicSuggestions.jsx");
var eventBus = require("../eventBus.js");
var magic = require("./magic.js");
var magicInputStore = require('./magicInputStore.js');
var isKey = require('../utilities.js').isKey;

var MagicInput = React.createClass({
  componentDidMount: function(){
    eventBus.register('magicInput', function() {
      this.setState(magicInputStore.getState());
    }.bind(this));
  },
  getInitialState: function(){
    return magicInputStore.getState();
  },
  handleShortcut: function(e){
    // Tab or down
    var state = magicInputStore.getState();
    if(isKey(e, 'TAB', 'DOWN_ARROW')){
      e.preventDefault();
      magicInputStore.activeSuggestionDown(true)
    // Up
    }else if(isKey(e, 'UP_ARROW')){
      e.preventDefault();
      magicInputStore.activeSuggestionUp(true);
    }
  },
  handleInput: function(e){
    var el = document.getElementById('terminal');
    var state = magicInputStore.getState();
    if (isKey(e, 'ENTER')) {
        magic.callCommand(magicInputStore.getCurrentCommand(), magicInputStore.getCurrentArgs());
        el.value = '';
        magicInputStore.resetState(true);
    }
  },
  onChange: function(e){
    var state = magicInputStore.getState();
    /*
      results = {
        suggestions: []commands
        arguments: []string
      }
    */
    var results = magic.search(e.target.value);
    var chain = magicInputStore
                  .setSuggestions(results.suggestions)
                  .setArguments(results.arguments);
    // If arguments there, then set args suggestions
    if(_.isString(results.arguments)){
      var argsSugs = magic.searchArgs(magicInputStore.getCurrentCommand(), results.arguments);
      chain.setArgsSuggestions(argsSugs, true);
    }else{
      chain.setArgsSuggestions(null, true);
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
          <MagicSuggestions suggestionArgsActive = {this.state.suggestionArgsActive} suggestionActive={this.state.suggestionActive} suggestions={this.state.suggestions} argsSuggestions={this.state.argsSuggestions}/>
        </div>
      </div>
    );
  }
});

module.exports = MagicInput;
