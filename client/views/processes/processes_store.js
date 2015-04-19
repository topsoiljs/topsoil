var eventBus = require('../../eventBus.js');
var createNewStream = require('../../streaming/streaming_client.js').createNewStream;
function ProcessesViewStore(eventName) {
  var state = {
    outputs:[],
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
      var out = {
        command: args.command,
        args: args.args,
        output: []
      };
      state.outputs.push(out);
      streams[args.args] = createNewStream({
        command: 'terminal.callCommand',
        cb: function(data){
          out.output.push(data.data);
          render();
        },
        opts: {
          opts: {cwd: state.pwd},
          cmd: args.command,
          args: args.args.split(' ')
        },
        initialData: " ",
        infoCB: function(data){
          console.log('infocb', data);
        }
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
