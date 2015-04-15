var ReplComponent = React.createClass({
  getInitialState: function() {
    return replViewStore.getState();
  },
  componentDidMount: function() {
    eventBus.register("repl", function() {
      this.setState(replViewStore.getState());
    }.bind(this));
  },
  render: function() {
    var nodes = [];
    var currentCol = [];
    for(var i=0;i<this.state.output.length;i++){
      nodes.push(
        <div>
            {this.state.output[i]}
        </div>
        )
    }

    var fileData = this.state.fileData;
    return (<div>
       <h4>REPL</h4>
       <row>
        {nodes}
       </row>
       <input onKeyUp={this.handleInput}>
       </input>
    </div>);
  }
});

var replViewStore = ReplViewStore();
magic.registerView({
  name: 'repl',
  commands: [
     {
      name: "startRepl",
      description: 'starts a node.js repl, connecting to server',
      args: [],
      tags: ['start repl', 'start node.js', 'connect to server', 'repl', 'Repl'],
      categories: ['read'],
      method: replViewStore['start']
    }
    ],
  category: 'repl',
  component: ReplComponent
});
