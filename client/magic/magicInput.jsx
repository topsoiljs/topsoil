var MagicSuggestions = require("./magicSuggestions.jsx");
var eventBus = require("../eventBus.js");
var magic = require("./magic.js");


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
    result = result || window._keys[keycode] === arguments[i];
  }
  return result;
};
function MagicInputStore (eventName){
  var initialState = {
      args: null,
      suggestions: [],
      argsSuggestions: [],
      suggestionActive: 0,
      argsSuggestionActive: 0,
      preArgsLength: 0
  };

  var state = _.cloneDeep(initialState);
  var render = function(){
    eventBus.emit(eventName);
  };
  // Methods returns itself, and allows last parameter to be an optional boolean that specifies rerender.
  var methods = {
    getState: function(){
      return state;
    },
    resetState: function(rend){
      state = _.cloneDeep(initialState);
      if(arguments[arguments.length-1]){
        render();
      }
      return methods;
    },
    setActiveSuggestion: function(sug, rend){
      state.suggestionActive = sug;
      if(arguments[arguments.length-1]){
        render();
      }
      return methods;
    },
    getCurrentCommand: function(){
      return state.suggestions[state.suggestionActive];
    },
    setSuggestions: function(suggestions, rend){
      state.suggestions = suggestions;
      if(arguments[arguments.length-1]){
        render();
      }
      return methods;
    },
    setArgsSuggestions: function(suggestions, rend){
      state.argsSuggestions = suggestions;
      if(arguments[arguments.length-1]){
          render();
      }
      return methods;
    },
    setArguments: function(args){
      state.args = args;
      return methods;
    },
    activeSuggestionUp: function(rend){
      var active = (state.suggestionActive - 1);
      if(active < 0){
        active = state.suggestions.length-1;
      }
      methods.setActiveSuggestion(active);
      if(arguments[arguments.length-1]){
          render();
      }
      return methods;
    },
    activeSuggestionDown: function(rend){
      var active = (state.suggestionActive + 1) % state.suggestions.length;
      methods.setActiveSuggestion(active);
      if(arguments[arguments.length-1]){
          render();
      }
      return methods;
    },
    render: render
  };

  return methods;
};

var magicInputStore = MagicInputStore('magicInput');
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
        magic.callCommand(magicInputStore.getCurrentCommand(), state.args);
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
          <MagicSuggestions suggestionActive={this.state.suggestionActive} suggestions={this.state.suggestions} argsSuggestions={this.state.argsSuggestions}/>
        </div>
      </div>
    );
  }
});

module.exports = MagicInput;
