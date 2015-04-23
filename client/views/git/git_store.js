var eventBus = require("../../eventBus.js");
var magic = require("../../magic/magic.js");
var createNewStream = require("../../streaming/streaming_client.js").createNewStream;

function GitViewStore() {
  console.log('git view is loaded');
  var state = {status: false,
               diff: {
                staged: {},
                unstaged: {}
               },
               currentDir: '/Users/Derek/Desktop/topsoil'};

  var socket = io();
  var streams = {};
  var methods = {
    status: function(updateDiff){
      streams['git.status'] = createNewStream({
        command: 'git.status',
        opts: {
          opts: {cwd: state.currentDir},
          args: ['status', '-s']
        },
        cb: function(data){
          state.status = JSON.parse(data.data);
          eventBus.emit('git');
          // if(updateDiff){
            methods.differenceAll(state.status);
          // }
        },
        initialData: ' '
      });

      streams['git.status'].emit('get');
    },
    streamStatus: function(args){
      streams['chain'] = createNewStream({
        command: 'chain',
        opts: {
          commands: [
            {
              name: 'fs.watchFile',
              opts: {
                dir: args.dir + '/.git'
              }
            },
            {
              name: 'git.status',
              opts: {
                cwd: args.dir,
                args: ['status', '-s'],
                initialData: " "
              }
            }
          ]
        },
        cb: function(data){
          console.log(data, 'GOT END OF CHAIN');
        }
      });
    },
    setPWD: function(args){
      $.post('/state/git/pwd', {data: args.pwd})
        .done(function(){
          state.currentDir = args.pwd;
          eventBus.emit('git');
        })
        .fail(function(){
          console.log('failed posting pwd')
        })
    },
    add: function(fileName){
      streams['git.add'] = createNewStream({
        command: 'git.add',
        opts: {
          args: ['add', fileName],
          opts: {cwd: state.currentDir}
        },
        cb: function(data){
          streams['git.status'].emit('get');
        }
      });
      streams['git.add'].emit('add');
    },

    reset: function(fileName){

      streams['git.reset'] = createNewStream({
        command: 'git.reset',
        opts: {
          args: ['reset', 'HEAD', fileName],
          opts: {cwd: state.currentDir}
        },
        cb: function(data){
          streams['git.status'].emit('get');
        }
      });
      streams['git.reset'].emit('reset');
    },

    difference: function(fileName, staging, key){

      key = key || 0;

      streams['git.diff'+key] = createNewStream({
        command: 'git.diff',
        opts: {
          opts: {cwd: state.currentDir},
          args: ['diff', '--no-prefix', fileName],
        },
        cb: function(data){
          var res = JSON.parse(data.data);
          state.diff[staging][fileName] = res.text;
          eventBus.emit('git');
        }
      });

      streams['git.diff'+key].emit('cat');

    },

    differenceAll : function(status){

      var key = 0
      // methods.newDiff();
      status.unstaged.forEach(function(file){
        methods.difference(file, 'unstaged', key++);
      })
      // status.staged.forEach(function(file){
      //   methods.difference(file, 'staged');
      // })
    },

    newDiff : function(){
      state.diff = {
                    staged: {},
                    unstaged: {}
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

module.exports = GitViewStore();
