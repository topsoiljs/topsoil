var processesStore = require("./processes_store.js");
var magic = require("../../magic/magic.js");
var eventBus = require("../../eventBus.js");
var ProcessComponent = require('./components/process');
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
    this.state.outputs.forEach(function(el){
      nodes.push(<ProcessComponent proc={el}/>)
    });
    var fileData = this.state.fileData;
    return (<div>
      <h4>PROCESSES</h4>
      <h5>{this.state.pwd}</h5>
      <div className="ui cards">
        {nodes}
      </div>
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
    },
    {
      name: 'Open processes view',
      description: 'open processes view',
      args: ['pwd'],
      tags: ['open processes view'],
      categories: ['read'],
      method: processesStore['renderView']
    }
  ],
  category: 'processes',
  component: ProcessesComponent,
  icon: 'search'
});
