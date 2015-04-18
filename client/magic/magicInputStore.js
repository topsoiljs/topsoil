var eventBus = require("../eventBus.js");

function MagicInputStore (eventName){
  var initialState = {
      args: null,
      suggestions: [],
      argsSuggestions: [],
      suggestionArgsActive: -1,
      suggestionActive: 0,
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
    setActiveArgsSuggestion: function(sug, rend){
      state.suggestionArgsActive = sug;
      if(arguments[arguments.length-1]){
        render();
      }
      return methods;
    },
    getCurrentCommand: function(){
      return state.suggestions[state.suggestionActive];
    },
    getCurrentArgs: function(){
      if(state.suggestionArgsActive < 0){
        return state.args;
      }else{
        var currentArgs = state.argsSuggestions[state.suggestionArgsActive].name;
        return currentArgs === undefined ? state.args : currentArgs;
      }
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
      if(state.argsSuggestions){
        var active = (state.suggestionArgsActive - 1);
        if(active < -1){
          active = state.argsSuggestions.length-1;
        }
        methods.setActiveArgsSuggestion(active);
      }else{
        var active = (state.suggestionActive - 1);
        if(active < 0){
          active = state.suggestions.length-1;
        }
        methods.setActiveSuggestion(active);
      }
      if(arguments[arguments.length-1]){
          render();
      }
      return methods;
    },
    activeSuggestionDown: function(rend){
      if(state.argsSuggestions){
        var active = (state.suggestionArgsActive + 1) % state.argsSuggestions.length;
        methods.setActiveArgsSuggestion(active);
      }else{
        var active = (state.suggestionActive + 1) % state.suggestions.length;
        methods.setActiveSuggestion(active);
      }
      if(arguments[arguments.length-1]){
          render();
      }
      return methods;
    },
    render: render
  };

  return methods;
};

module.exports = MagicInputStore('magicInput');
