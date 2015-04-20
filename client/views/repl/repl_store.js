var eventBus = require("../../eventBus.js");
var createNewStream = require("../../streaming/streaming_client.js").createNewStream;

function ReplViewStore() {
  var state = {
    output: []
  };
  var streams = {};

  var methods = {
    start: function(args){
      streams['repl'] = createNewStream({
        command: 'repl.start',
        cb: function(data){
          state.output.push(data);
          eventBus.emit('repl');
        },
        initialData: '(function(){return "Welcome to your REPL"})()\n'
      })
    },
    send: function(data){
      if(streams['repl']){
        data += '\n';
        streams['repl'].emit(data);
      }
    },
    renderView: function(){
    },
    getState: function() {
      return state;
    }
  }

  return methods;
}

module.exports = ReplViewStore();
