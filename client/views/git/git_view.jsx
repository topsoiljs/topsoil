function gitViewStore() {
  console.log('git view is loaded');
  var state = {status: false,
               currentDir: '/Users/Derek/Desktop/topsoil'};
  var socket = io();

  var methods = {
    status: function(args){
      var dir = args.directory;
      var UID = Math.random();
      socket.emit('git.status', {
        cmd: 'git',
        args: ['-s'],
        dir: state.currentDir,
        uid: UID
      });
      socket.on(UID, function(data){
        console.log(data);
        state.status = data.data;
        eventBus.emit('git');
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

var gitViewStore = gitViewStore();

var GitComponent = React.createClass({
  getInitialState: function() {
    return gitViewStore.getState();
  },
  componentDidMount: function() {
    eventBus.register("git", function() {
      this.setState(gitViewStore.getState());
    }.bind(this));
  },
  render: function() {

    if(this.state.status){
      var staged = this.state.status.staged.map(function(file){
              return <li>{file}</li>
            });

      var unstaged = this.state.status.unstaged.map(function(file){
              return <li>{file}</li>
            });

      var untracked = this.state.status.untracked.map(function(file){
              return <li>{file}</li>
            });
    }

    return (<row>
       <h4>Git View</h4>
       <row>
        <h5>Staged</h5>
          <ul>
            {staged}
          </ul>
       </row>
       <row>
        <h5>unstaged</h5>
          <ul>
            {unstaged}
          </ul>
       </row>
       <row>
        <h5>Untracked</h5>
          <ul>
            {untracked}
          </ul>
       </row>
       {status}
    </row>);
  }
});

magic.registerView({
  name: 'git',
  commands: [
     {
      name: "status",
      description: 'current git status',
      args: ['directory'],
      tags: ['show git', 'git', 'status', 'ls'],
      categories: ['read'],
      method: gitViewStore["status"]
    }
    ],
  category: 'git',
  component: GitComponent
});
