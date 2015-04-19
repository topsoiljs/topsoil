var processesStore = require("./processes_store.js");
var magic = require("../../magic/magic.js");
var eventBus = require("../../eventBus.js");

var ProcessesComponent = React.createClass({
  getInitialState: function() {
    return processesStore.getState();
  },
  componentDidMount: function() {
    eventBus.register("processes", function() {
      this.setState(processesStore.getState());
    }.bind(this));
  },
  render: function() {
    var nodes = [];

    var fileData = this.state.fileData;
    return (<div>
       <h4>PROCESSES</h4>
       <h5>{this.state.pwd}</h5>
       <row>
        {nodes}
       </row>
    </div>);
  }
});
magic.registerView({
  name: 'processes',
  commands: [
     {
      name: 'Start Process',
      description: 'starts a process or script',
      args: ['command', 'args'],
      tags: ['start process', 'start script', 'processes'],
      categories: ['write'],
      method: processesStore['start']
    },
    {
      name: 'Set Current Working Directory (Processes)',
      description: 'sets current Working directory for processes view',
      args: ['pwd'],
      tags: ['set ', 'pwd', 'current working', 'directory', 'present working directory'],
      categories: ['write'],
      method: processesStore['setPWD']
    }
  ],
  category: 'processes',
  component: ProcessesComponent
});
