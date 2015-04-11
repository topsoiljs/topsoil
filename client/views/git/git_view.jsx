function GitViewStore() {
  console.log('git view is loaded');
  var state = {status: false,
               currentDir: '/Users/Derek/Desktop/topsoil'};
  var socket = io();

  var methods = {
    status: function(args){
      // var dir = args.directory;
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
    add: function(data){
      var self = this;
      var UID = Math.random();
      socket.emit('git.add', {
        args: [data],
        dir: state.currentDir,
        uid: UID
      });
      socket.on(UID, function(data){
        methods.status()
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
        methods.status()
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

    if(this.state.status){
      var staged = this.state.status.staged.map(function(file){
              return <GitStaged fileName = {file}/>
            });

      var unstaged = this.state.status.unstaged.map(function(file){
              return <GitUnstaged fileName = {file}/>
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

var GitButton = React.createClass({
  handleAddClick: function(e){
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
