var eventBus = require("../../eventBus.js");
var magic = require("../../magic/magic.js");
var gitViewStore = require('./git_store.js');

var GitSubViewComponent = React.createClass({
  getInitialState: function(){
    return gitViewStore.getState();
  },
  componentDidMount: function() {
    eventBus.register("git", function() {
      this.setState(gitViewStore.getState());
    }.bind(this));
  },
  render: function(){
    return (
      <div className="subview">
        <span className="git directory">{this.state.currentDir}</span> on branch <span className="git branch">{this.state.status.branch}</span>
      </div>
    )
  }
});
magic.registerSubView({
  name: 'gitSubview',
  parentView: 'git',
  component: GitSubViewComponent
});
