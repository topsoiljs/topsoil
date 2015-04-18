var eventBus = require("./eventBus.js");
var _ = require("lodash");

function MasterStore() {

  var magicData = {
   args: null,
   currentCommand: null,
   suggestions: magic.getAllCommands(),
   suggestionActive: -1,
   preArgsLength: 0
  }

  var state = {
              activeView: undefined, 
              magicData: _.cloneDeep(magicData)
            }
  
  var masterStore = {
    openView: function(newViewComponent) {
      state.activeView = newViewComponent;
      eventBus.emit("master");
    },
    closeView: function() {
      
    },
    getState: function() {
      return state;
    },
    setActiveSuggestion: function(sug){
      state.magicData.suggestionActive = sug;
      eventBus.emit('master');
    },
    setCurrentCommand: function(command){
      state.magicData.currentCommand = command;
      state.magicData.args = [];
      eventBus.emit('master');
    },
    setSuggestions: function(suggestions){
      state.magicData.suggestions = suggestions;
      eventBus.emit('master');
    }, 
    resetState: function() {
      state.magicData = magicData;
      eventBus.emit('master');
    }
  }

  return masterStore; 
}

module.exports = MasterStore();