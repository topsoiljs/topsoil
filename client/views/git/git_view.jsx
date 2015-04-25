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
              return <GitStaged fileName = {file}/>
            });

      var unstaged = this.state.status.unstaged.map(function(file){
              if(self.state.diff.unstaged[file]){
                return (
                <div>
                  <div><GitUnstaged fileName = {file}/></div>
                  <div className="gitDiff"><GitDiff diff = {self.state.diff.unstaged[file]}/></div>
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
       <h4>Git View (branch: {this.state.status.branch})</h4>
       <GitButton fileName = '.' action='add' label='Add All'/>
       <GitButton fileName = '.' action='reset' label='Reset All'/>
       <row>
        <h5>Staged</h5>
          <ul className='gitItem'>
            {staged}
          </ul>
       </row>
       <row>
        <h5>Unstaged</h5>
          <ul className='gitItem'>
            {unstaged}
          </ul>
       </row>
       <row>
        <h5>Untracked</h5>
          <ul className='gitItem'>
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

    var classMap = {
      '-': 'gitRemoval',
      '+': 'gitAddition',
      '': 'gitOther',
      ' ': 'gitOther',
    }
    //should pass in a file and staging property
    var result = this.props.diff.map(function(code){
      // console.log('code is ', code[0]);
      // console.log('classmap is', classMap[code[0]]);
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
    }
  ],
  category: 'git',
  icon: "git-square",
  component: GitComponent,
  noAutoRender: true
});
