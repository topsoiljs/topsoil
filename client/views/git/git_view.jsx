var eventBus = require("../../eventBus.js");
var magic = require("../../magic/magic.js");
var gitViewStore = require('./git_store.js');

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
              return (
                <div className="ui vertical segment">
                  <GitStaged fileName = {file}/>
                </div>
              )
            });

      var unstaged = this.state.status.unstaged.map(function(file){
              if(self.state.diff.unstaged[file]){
                return (
                <div className="ui vertical segment">
                  <div><GitUnstaged fileName = {file} diff = {self.state.diff.unstaged[file]}/></div>
                </div>
                );
              }

              return (
                <div>
                  <div className="ui vertical segment"><GitUnstaged fileName = {file}/></div>
                </div>
                );
            });

      var untracked = this.state.status.untracked.map(function(file){
              return <GitUntracked fileName = {file}/>
            });
    }

    return (<row>
       <h2>Git View (branch: {this.state.status.branch})</h2>
       <GitButton fileName = '.' action='add' label='Add All' color="green" icon="plus"/>
       <GitButton fileName = '.' action='reset' label='Reset All' color="red" icon="minus"/>
       <GitCommit/>
       <div className="ui segment">
        <h3>Staged</h3>
          <ul className='gitItem'>
            {staged}
          </ul>
       </div>
       <div className="ui segment">
        <h3>Unstaged</h3>
          <ul className='gitItem'>
            {unstaged}
          </ul>
       </div>
       <div className="ui segment">
        <h3>Untracked</h3>
          <ul className='gitItem'>
            {untracked}
          </ul>
       </div>
       {status}
    </row>);
  }
});

var GitStaged = React.createClass({
  render: function(){
    var fileName = this.props.fileName;
    return (
      <li>
        <span className = 'gitFileName'>{fileName}</span>
        <GitButton fileName = {fileName} action='reset' label='Reset' color="red" icon="minus"/>
      </li>
    );
  }
});

var GitUnstaged = React.createClass({

  getInitialState: function() {
    return {
      hideDiff: 'hide'
    };
  },

  toggleDiff: function(item) {
    var toggle = this.state.hideDiff ==='hide' ? 'show' : 'hide'
    this.setState({
      hideDiff: toggle
    });
  },

  render: function(){
    var fileName = this.props.fileName;
    var diff = this.props.diff || [];
    var self = this;
    return (
      <li>
        <span className = 'gitFileName'>{fileName}</span>
        <GitButton fileName = {fileName} action='add' label='Add' color="green" icon="plus"/>
        <GitButton handleDiff = {self.toggleDiff} fileName = {fileName} action='difference' label='Diff' color="blue" icon="expand"/>
        <div className={"gitDiff " + this.state.hideDiff}><GitDiff diff = {diff}/></div>
      </li>
    );
  }
});

var GitUntracked = React.createClass({

  render: function(){
    var fileName = this.props.fileName;
    return (
      <li>
        <span className = 'gitFileName'>{fileName}</span>
        <GitButton fileName = {fileName} action='add' color="green" icon="plus"/>
      </li>
    );
  }
});

var GitDiff = React.createClass({
  render: function(){

    var classMap = {
      '-': 'gitRemoval',
      '+': 'gitAddition',
      '': 'gitOther',
      ' ': 'gitOther',
    }
    //should pass in a file and staging property
    var result = this.props.diff.map(function(code){
      return (
        <div className={classMap[code[0]]}>
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
      <div className={"ui white large message "}>
        <i className="close icon"></i>
        {result}
      </div>
    )
  }
});

var GitButton = React.createClass({
  handleAddClick: function(e){
    if(this.props.action ==='difference'){
      this.props.handleDiff(this);
      return;
    }
    if(this.props.action ==='commit'){
      this.props.onClick();
    }
    gitViewStore[this.props.action](this.props.fileName);
  },
  render: function(){
    if(!this.props.label){
      this.props.label = this.props.action;
    }
    return (
      <button className = {"medium ui button animated " + this.props.color} onClick={this.handleAddClick}>
        <div className = "visible content">{this.props.label}</div>
        <div className = "hidden content">
          <i className = {this.props.icon + " icon"}></i>
        </div>
      </button>
    )
  }
})

var GitCommit = React.createClass({
  getInitialState: function() {
     return {message: ''};
   },
   handleChange: function(event) {
     this.setState({message: event.target.value});
   },
   reset: function(event){
     this.setState({message: ''});
   },
  render: function(){
    return (
      <span className = "gitCommitContainer">
        <span className="ui input">
         <input type="text" value = {this.state.message} placeholder="Commit Message..." onChange={this.handleChange}/>
        </span>
        <GitButton onClick = {this.reset} fileName = {this.state} action='commit' label='Commit' color="orange" icon="write"/>
      </span>
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
      method: gitViewStore["status"],
      render: true
    },
    {
      name: "Set PWD (git)",
      description: 'set current PWD for git',
      args: ['pwd'],
      tags: ['set pwd git'],
      categories: ['write'],
      method: gitViewStore["setPWD"]
    },
    {
      name: "Stream Status",
      description: 'watch directory and continuously update git status',
      args: ['dir'],
      tags: ['git status stream'],
      categories: ['read'],
      method: gitViewStore['streamStatus']
    },
    {
      name: "Commit Add with Message",
      description: 'Equivalent of git commit -am',
      args: ['message'],
      tags: ['git commit add message', 'git commit -am'],
      categories: ['write'],
      method: gitViewStore['commitAdd']
    },
    {
      name: "Push to remote",
      description: 'Push to remote',
      args: ['remote', 'branch'],
      tags: ['git push', 'push to remote'],
      categories: ['write'],
      method: gitViewStore['push']
    },
    {
      name: "Render Git View",
      description: 'current git status',
      args: [],
      tags: ['show git', 'git', 'status', 'ls'],
      categories: ['read'],
      method: gitViewStore["renderView"],
      render: true
    },
    {
      name: "Change Branch",
      description: 'Runs git checkout to change branches',
      args: ['branch'],
      tags: ['checkout git', 'change branch'],
      categories: ['write'],
      method: gitViewStore["checkout"]
    }
  ],
  category: 'git',
  icon: "git-square",
  component: GitComponent,
  noAutoRender: true
});
