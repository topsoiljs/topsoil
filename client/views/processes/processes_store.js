var eventBus = require('../../eventBus.js');
var createNewStream = require('../../streaming/streaming_client.js').createNewStream;
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
      args.args = args.args || "";
      console.log(args);
      streams['terminal.callCommand'] = createNewStream({
        command: 'terminal.callCommand',
        cb: function(data){
          console.log(data);
        },
        opts: {
          opts: {cwd: state.pwd},
          cmd: args.command,
          args: args.args.split(' ')
        },
        initialData: " "
      });
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
