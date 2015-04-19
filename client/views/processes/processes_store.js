var eventBus = require("../../eventBus.js");

function ProcessesViewStore() {
  var state = {
    output: []
  };
  var streams = {};

  var methods = {
    start: function(args){
    },
    renderView: function(){
    },
    getState: function() {
      return state;
    }
  }

  return methods;
}

module.exports = ProcessesViewStore();
