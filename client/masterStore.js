var eventBus = require("./eventBus.js");
var _ = require("lodash");

/*
  No component can be required here if that component requires another
  thing that needs the master store. Due to the order browserify loads things.
  John was right we should manually manage our deps through some kind
  of hub page...
*/

function MasterStore() {

  var initialMagicData = {
      args: null,
      suggestions: [],
      argsSuggestions: [],
      suggestionArgsActive: -1,
      suggestionActive: 0,
      preArgsLength: 0,
      isArgumentsMode: false
  };

  var state = {
              activeView: null,
              magicData: _.cloneDeep(initialMagicData)
            };

  var updateMethods = {
    //VIEW METHODS
    openView: function(newViewComponent) {
      state.activeView = newViewComponent;
    },
    //MAGIC METHODS
    resetState: function(rend){
      state.magicData = _.cloneDeep(initialMagicData);
    },
    setActiveSuggestion: function(sug){
      state.magicData.suggestionActive = sug;
    },
    setActiveArgsSuggestion: function(sug){
      state.magicData.suggestionArgsActive = sug;
    },
    setSuggestions: function(suggestions){
      state.magicData.suggestions = suggestions;
    },
    setArgsSuggestions: function(suggestions){
      state.magicData.argsSuggestions = suggestions;
    },
    setArguments: function(args){
      state.magicData.args = args;
    },
    setMagic: function(obj) {
      _.extend(state.magicData, obj);
    },
    activeSuggestionUp: function(){
      if(state.magicData.argsSuggestions){
        var active = (state.magicData.suggestionArgsActive - 1);
        if(active < -1){
          active = state.magicData.argsSuggestions.length-1;
        }
        updateMethods.setActiveArgsSuggestion(active);
      }else{
        var active = (state.magicData.suggestionActive - 1);
        if(active < 0){
          active = state.magicData.suggestions.length-1;
        }
        updateMethods.setActiveSuggestion(active);
      }
    },
    activeSuggestionDown: function(){
      if(state.magicData.argsSuggestions){
        var active = (state.magicData.suggestionArgsActive + 1) % state.magicData.argsSuggestions.length;
        updateMethods.setActiveArgsSuggestion(active);
      }else{
        var active = (state.magicData.suggestionActive + 1) % state.magicData.suggestions.length;
        updateMethods.setActiveSuggestion(active);
      }
    },
  };

  var nonUpdateMethods = {
    getState: function() {
      return state;
    }
  };

  var methods = nonUpdateMethods;

  //Cause all of the update methods to update the view.
  //Maybe for performance don't bake this in. could just have an update method outside of the store.
  _.each(updateMethods, function(func, name) {
    methods[name] = function() {
      func.apply(null,arguments);
      eventBus.emit("master");
    }
  });

  return methods;
}

module.exports = MasterStore();
