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
    this.state.outputs.forEach(function(el){
      var nodesOne = _.reduceRight(el.output, function(total, current){
        total.push((<div>{current}</div>));
        return total;
      }, []);
      nodes.push((
        <div className="process card">
          <div className="content">
            <div className="header">{el.command} | {el.args}</div>
            <div className="description">
              {nodesOne}
            </div>
          </div>
        </div>))
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
    }
  ],
  category: 'processes',
  component: ProcessesComponent,
  icon: 'search'
});
