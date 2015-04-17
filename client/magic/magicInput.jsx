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
    result = result || window._keys[keycode] === arguments[i]
  }
  return result;
};

function MagicInputStore (eventName){
  var initialState = {
      args: null,
      currentCommand: null,
      suggestions: [],
      suggestionActive: -1,
      preArgsLength: 0
  };

  var state = _.cloneDeep(initialState);
  var render = function(){
    eventBus.emit(eventName);
  };
  var methods = {
    getState: function(){
      return state;
    },
    resetState: function(){
      state = _.cloneDeep(initialState);
      render();
    },
    setActiveSuggestion: function(sug){
      state.suggestionActive = sug;
      render();
    },
    setCurrentCommand: function(command){
      state.currentCommand = command;
      state.args = [];
      render();
    },
    setSuggestions: function(suggestions){
      state.suggestions = suggestions;
      render();
    }
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
      magicInputStore.setActiveSuggestion((state.suggestionActive + 1) % state.suggestions.length)
    // Up
    }else if(isKey(e, 'UP_ARROW')){
      e.preventDefault();
      var active = (state.suggestionActive - 1) % state.suggestions.length;
      if(active < 0){
        active = state.suggestions.length-1;
      }
      magicInputStore.setActiveSuggestion(active);
    }
  },
  handleInput: function(e){
    var el = document.getElementById('terminal');
    var state = magicInputStore.getState();
    if (isKey(e, 'ENTER')) {
      if(state.suggestionActive < 0){
        state.suggestionActive = 0;
      }
      if(!state.args && state.suggestions[state.suggestionActive]){
        el.value = el.value += ' ';
        state.preArgsLength = el.value.length;
        magicInputStore.setCurrentCommand(state.suggestions[state.suggestionActive]);
      }else{
        var value = el.value;
        args = value.slice(state.preArgsLength).split(' ');
        magic.callCommand(state.currentCommand, args);
        el.value = '';
        magicInputStore.resetState();
      }
    }
  },
  onChange: function(e){
    var state = magicInputStore.getState();
    if(!state.args){
      var results = magic.search(e.target.value);
      magicInputStore.setSuggestions(results);
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

module.exports = MagicInput;
