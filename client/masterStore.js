var eventBus = require("./eventBus.js");
var wrapAround = require("./utilities.js").wrapAround;
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
      argsSuggestions: null,
      suggestionArgsActive: -1,
      suggestionActive: 0,
      preArgsLength: 0,
      isArgumentsMode: false,
      activeArgumentIndex: 0,
      isEditing: false,
      inputArr: [{text: "", placeholder: "start", isArg: false, index: 0}]
  };

  var state = {
              activeView: null,
              magicData: _.cloneDeep(initialMagicData),
              ctx: false
            };

  var updateMethods = {
    //VIEW METHODS
    openView: function(newViewComponent) {
      state.activeView = newViewComponent;
    },
    //MAGIC METHODS
    resetState: function( ){
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
    setDefaultSuggestions: function(suggestions){
      //This is a horrible hack.
      state.magicData.suggestions = suggestions;
      initialMagicData.suggestions = suggestions;
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
    //These can all be nicely refactored.
    activeIndexRight: function() {
      state.magicData.activeArgumentIndex = wrapAround(state.magicData.activeArgumentIndex + 1, state.magicData.inputArr.length);
    }, 
    activeIndexLeft: function() {
      state.magicData.activeArgumentIndex = wrapAround(state.magicData.activeArgumentIndex - 1, state.magicData.inputArr.length);
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
    setCommandText: function(text) {
      state.magicData.inputArr[0].text = text;
    }, 
    enterArgsMode: function() {
      var magicData = state.magicData;

      magicData.isArgumentsMode = true;
      magicData.activeArgumentIndex = 1;
      var args = magicData.suggestions[magicData.suggestionActive].args;

      args.forEach(function(arg, index) {
        //Add one to the index because the command is already at index 0
        magicData.inputArr.push({isArg: true, index: index + 1, text: "", placeholder: arg});
      });
    },
    setActiveArgumentText: function(text) {
      state.magicData.inputArr[state.magicData.activeArgumentIndex].text = text;
    },
    setCTX: function(ctx) {
      state.ctx = ctx;
    }
  };

  var nonUpdateMethods = {
    getState: function() {
      return state;
    },
    getTextSize: function(text) {
      if(state.ctx) {
        return state.ctx.measureText(text).width;  
      }
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
