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
    console.log('rendering subview');
    return (
      <div className="subview">directory: {this.state.currentDir} branch: {this.state.branch}</div>
    )
  }
});
magic.registerSubView({
  name: 'gitSubview',
  parentView: 'git',
  component: GitSubViewComponent
});
