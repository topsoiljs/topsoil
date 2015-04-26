var eventBus = require("../../eventBus.js");
var magic = require("../../magic/magic.js");
var createNewStream = require("../../streaming/streaming_client.js").createNewStream;

function GitViewStore() {
  var state = {status: {staged:[], unstaged:[], untracked:[]},
               diff: {
                staged: {},
                unstaged: {}
               },
               currentDir: ''};

  var streams = {};

  var methods = {
    init: function(){
      $.get('/state/git/pwd')
        .done(function(data){
          state.currentDir = data;
          methods.status({directory: data});
        })
        .fail(function(){
          console.log('failed getting pwd')
        });
    },
    checkout: function(args){
      streams['git.checkout'] = createNewStream({
        command: 'git.checkout',
        opts: {
          opts: {cwd: state.currentDir},
          args: [args.branch]
        },
        cb: function(data){
          eventBus.emit('git');
        },
        initialData: ' '
      });
    },
    commitAdd: function(args){
      streams['git.commitAdd'] = createNewStream({
        command: 'git.commitAdd',
        opts: {
          opts: {cwd: state.currentDir},
          args: [args.message]
        },
        cb: function(data){
          eventBus.emit('git');
        },
        initialData: ' '
      });
    },
    push: function(args){
      streams['git.push'] = createNewStream({
        command: 'git.push',
        opts: {
          opts: {cwd: state.currentDir},
          args: [args.remote, args.branch]
        },
        cb: function(data){
          eventBus.emit('git');
        },
        initialData: ' '
      });
    },
    status: function(updateDiff){
      console.log('the current directory is ', state.currentDir);
      if(updateDiff.directory){
        state.currentDir = updateDiff.directory;
      }
      streams['git.status'] = createNewStream({
        command: 'git.status',
        opts: {
          opts: {cwd: state.currentDir}
        },
        cb: function(data){
          console.log('the data is', data);
          state.status = JSON.parse(data.data);

          console.log('the status is', state.status);
          eventBus.emit('git');
          methods.differenceAll(state.status);
        },
        initialData: ' '
      });
    },
    streamStatus: function(args){
      args.dir = args.dir || state.currentDir;
      streams['chain'] = createNewStream({
        command: 'chain',
        opts: {
          commands: [
            {
              name: 'fs.watchFile',
              opts: {
                dir: args.dir
              }
            },
            {
              name: 'git.status',
              opts: {
                cwd: args.dir
              }
            }
          ]
        },
        cb: function(data){
          state.status = JSON.parse(data.data);
          eventBus.emit('git');
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
          args: [fileName],
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
          args: [fileName],
          opts: {cwd: state.currentDir}
        },
        cb: function(data){
          streams['git.status'].emit('get');
        }
      });
      streams['git.reset'].emit('reset');
    },

    difference: function(fileName, staging, key){
      console.log('called diff on ', fileName);
      key = key || 0;

      streams['git.diff'+key] = createNewStream({
        command: 'git.diff',
        opts: {
          opts: {
            cwd: state.currentDir
          },
          args: [fileName]
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
      console.log('differenceAll got called');
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
