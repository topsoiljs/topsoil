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
          opts: {cwd: state.currentDir},
          args: ['status', '-s'],
        },
        cb: function(data){
          state.status = JSON.parse(data.data);
          eventBus.emit('git');
          if(updateDiff){
            methods.differenceAll(state.status);
          }
        }
      });

      streams['git.status'].emit('get');
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

    reset: function(file){

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

    console.log('the properties that we get is ',this.props.diff);
    //should pass in a file and staging property
    var result = this.props.diff.map(function(code){
      console.log(code);
      return (
        <div>
          <span>
            {code[0]+'  '}
          </span>
          <span>
            {code[1].replace(/ /g, "\u00a0")}
          </span>
        </div>
        );
    })
    return (
      <div>
        {result}
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
