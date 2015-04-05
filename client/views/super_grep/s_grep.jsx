//To Do:
//Get actual uid randomness


function GrepStore() {
  var state = {file: [], 
               regex: []};
  var socket = io();

  var methods = {
    openFile: function(args){
          var dir = args.directory;
          var filename = args.filname;

          var UID = Math.random();

          socket.emit("file"/* Ask for file here */, {
            dir: dir,
            uid: UID
          });
          socket.on(UID, function(data){
            /* Get back file here. */

            eventBus.emit('s_grep');
          })
    },
    getState: function() {
      return state;
    }
  }

  return methods;
}

var grepStore = GrepStore();

var SGrepComponent = React.createClass({
  getInitialState: function() {
    return grepStore.getState();
  },
  componentDidMount: function() {
    eventBus.register("s_grep", function() {
      this.setState(grepStore.getState());
    }.bind(this));
  },
  render: function() {
    return (<div>
       SUPER GREP
    </div>);
  }
});


magic.registerView({
  name: 'super grep',
  commands: [
    {
      name: "openFile",
      description: 'opens a file in a directory',
      args: ['directory', 'filename'],
      tags: ['get file', 'open', 'display file'],
      categories: ['open'],
      method: grepStore['openFile']
    }
  ],
  category: 'filesystem',
  component: SGrepComponent
});