var eventBus = require('../../eventBus.js');
var createNewStream = require('../../streaming/streaming_client.js').createNewStream;
var createNotification = require('../../notifications/notifications.js').createNotification;

function ProcessesViewStore(eventName) {
  var state = {
    outputs:{},
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
        output: [],
        pid: null
      };
      streams[args.args] = createNewStream({
        command: 'terminal.callCommand',
        cb: function(data){
          if(data.data.indexOf("Finished 'build-all") > -1){
            createNotification('Finished gulp build');
          };
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
          out.pid = data.pid;
          state.outputs[out.pid] = out;
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
    killProcess: function(args){
      streams['killProcess'] = createNewStream({
        command: 'processes.killProcess',
        cb: function(){
        },
        opts: {
        },
        initialData: String(args)
      });
      delete state.outputs[args];
      render();
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
