var eventBus = require("../../eventBus.js");

function ProcessesViewStore(eventName) {
  var state = {
    output: [],
    pwd: '/'
  };
  var streams = {};
  var render = function(){
    eventBus.emit(eventName);
  };
  $.get('/state/processes/pwd')
    .done(function(data){
      state.pwd = data;
      render();
  });
  var methods = {
    start: function(args){
    },
    setPWD: function(args){
      $.post('/state/processes/pwd', {data: args.pwd})
        .done(function(){
          state.pwd = args.pwd;
          render();
        })
        .fail(function(){
          console.log('failed posting pwd')
        })
    },
    renderView: function(){
    },
    getState: function() {
      return state;
    }
  }

  return methods;
}

module.exports = ProcessesViewStore('processes');
