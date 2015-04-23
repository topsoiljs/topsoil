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
          <ul>
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
    var result = this.props.diff.map(function(code){
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
