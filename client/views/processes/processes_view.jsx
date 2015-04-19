var processesStore = require("./processes_store.js");
var magic = require("../../magic/magic.js");
var eventBus = require("../../eventBus.js");

var ProcessesComponent = React.createClass({
  getInitialState: function() {
    return processesStore.getState();
  },
  componentDidMount: function() {
    eventBus.register("processes", function() {
      this.setState(replViewStore.getState());
    }.bind(this));
  },
  render: function() {
    var nodes = [];

    var fileData = this.state.fileData;
    return (<div>
       <h4>PROCESSES</h4>
       <row>
        {nodes}
       </row>
       </input>
    </div>);
  }
});



magic.registerView({
  name: 'processes',
  commands: [
     {
      name: 'Start Process',
      description: 'starts a process or script',
      args: [],
      tags: ['start process', 'start script', 'processes'],
      categories: ['write'],
      method: processesStore['start']
    }
  ],
  category: 'processes',
  component: ProcessesComponent
});
