var eventBus = require("../../eventBus.js");
var magic = require("../../magic/magic.js");

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
          cwd: state.currentDir,
          cmd: 'git',
          args: ['status', '-s'],
        },
        cb: function(data){
          console.log('we received data', data);
          state.status = JSON.parse(data.data);
          console.log('current status is ', state.status);
          eventBus.emit('git');
        }
        // initialData: currentDir
      });

      streams['git.status'].emit('something');
      // var dir = args.directory;
      // var UID = Math.random();
      // socket.emit('git.status', {
      //   cmd: 'git',
      //   args: ['-s'],
      //   dir: state.currentDir,
      //   uid: UID
      // });
      // socket.on(UID, function(data){
      //   state.status = data.data;
      //   if(updateDiff){
      //     methods.differenceAll(state.status);
      //   }
      //   eventBus.emit('git');
      //   console.log(state.status);
      // })
    },
    add: function(data){
      var self = this;
      var UID = Math.random();
      socket.emit('git.add', {
        args: [data],
        dir: state.currentDir,
        uid: UID
      });
      socket.on(UID, function(data){
        methods.status(true);
      })
    },

    reset: function(data){
      var self = this;
      var UID = Math.random();
      socket.emit('git.reset', {
        args: ['HEAD', data],
        dir: state.currentDir,
        uid: UID
      });
      socket.on(UID, function(data){
        methods.status(true);
      })
    },

    difference: function(fileName, staging){
      var self = this;
      var UID = Math.random();
      socket.emit('git.diff', {
        args: ['--no-prefix', fileName],
        dir: state.currentDir,
        uid: UID
      });
      socket.on(UID, function(diff){
        state.diff[staging][fileName] = diff.data.text;
        eventBus.emit('git');
      })
    },

    differenceAll : function(status){
      // methods.newDiff();
      status.unstaged.forEach(function(file){
        methods.difference(file, 'unstaged');
      })
      status.staged.forEach(function(file){
        methods.difference(file, 'staged');
      })
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

var gitViewStore = GitViewStore(); 

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
    var self = this;
    if(this.state.status){
      var staged = this.state.status.staged.map(function(file){
              return <GitStaged fileName = {file}/>
            });

      var unstaged = this.state.status.unstaged.map(function(file){
              console.log('state file name is ', JSON.stringify(file));
              console.log('state diff is ', self.state.diff);
              if(self.state.diff.unstaged[file]){
                return (
                <div>
                  <div><GitUnstaged fileName = {file}/></div>
                  <div><GitDiff diff = {self.state.diff.unstaged[file]}/></div>
                </div>
                );
              }

              return (
                <div>
                  <div><GitUnstaged fileName = {file}/></div>
                </div>
                );
            });

      var untracked = this.state.status.untracked.map(function(file){
              return <GitUntracked fileName = {file}/>
            });
    }

    return (<row>
       <h4>Git View</h4>
       <GitButton fileName = '.' action='add' label='Add All'/>
       <GitButton fileName = '.' action='reset' label='Reset All'/>
       <row>
        <h5>Staged</h5>
          <ul >
            {staged}
          </ul>
       </row>
       <row>
        <h5>Unstaged</h5>
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

var GitStaged = React.createClass({
  render: function(){
    var fileName = this.props.fileName;
    return (
      <li>
        {fileName}
        <GitButton fileName = {fileName} action='reset'/>
      </li>
    );
  }
});

var GitUnstaged = React.createClass({
  render: function(){
    var fileName = this.props.fileName;
    return (
      <li>
        {fileName}
        <GitButton fileName = {fileName} action='add'/>
        <GitButton fileName = {fileName} action='difference'/>
      </li>
    );
  }
});

var GitUntracked = React.createClass({
  render: function(){
    var fileName = this.props.fileName;
    return (
      <li>
        {fileName}
        <GitButton fileName = {fileName} action='add'/>
      </li>
    );
  }
});

var GitDiff = React.createClass({
  render: function(){
    //should pass in a file and staging property
    console.log("the property diff becomes this", this.props.diff);
    console.log("the result array should be ",JSON.stringify(this.props.diff));

    return (
      <div>
        See Difference here
        {this.props.diff}
      </div>
    )
  }
});

var GitButton = React.createClass({
  handleAddClick: function(e){
    if(this.props.action ==='difference'){
      gitViewStore[this.props.action](this.props.fileName, 'unstaged');
      return;
    }
    gitViewStore[this.props.action](this.props.fileName);
  },
  render: function(){
    if(!this.props.label){
      this.props.label = this.props.action;
    }
    return (
      <button onClick={this.handleAddClick}>
        {this.props.label}
      </button>
    )
  }
})

magic.registerView({
  name: 'git',
  commands: [
     {
      name: "Status",
      description: 'current git status',
      args: ['directory'],
      tags: ['show git', 'git', 'status', 'ls'],
      categories: ['read'],
      method: gitViewStore["status"]
    }
    ],
  category: 'git',
  icon: "git-square",
  component: GitComponent
});
