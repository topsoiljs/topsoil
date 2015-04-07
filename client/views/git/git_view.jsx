function gitViewStore() {
  console.log('git view is loaded');
  var state = {status: {},
               currentDir: '/Users/Derek/Desktop/topsoil'};
  var socket = io();

  var methods = {
    status: function(args){
      var dir = args.directory;
      var UID = Math.random();
      socket.emit('git.status', {
        cmd: 'git',
        args: [],
        dir: state.currentDir,
        uid: UID
      });
      socket.on(UID, function(data){
        console.log(data);
        state.status = data.data;
        eventBus.emit('git');
      })
    },
    renderView: function(){

    },
    getState: function() {
      return state;
    }
  }

  return methods;
}

var gitViewStore = gitViewStore();

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
    var nodes = [];
    var currentCol = [];
    // for(var i=0;i<this.state.files.length;i++){
    //   if(i % 15 === 0){
    //     nodes.push(
    //       <div className="col">
    //         <ul className="collection">
    //           {currentCol}
    //         </ul>
    //       </div>
    //       )
    //     currentCol = [];
    //   }else{
    //     currentCol.push(<li className="collection-item"> {this.state.files[i]} </li>)
    //   }
    // }
    // if(currentCol.length > 0){
    //   nodes.push(
    //     <div className="col">
    //       <ul className="collection">
    //         {currentCol}
    //       </ul>
    //     </div>
    //     )
    // }

    var status = this.state.status;
    return (<row>
       <h4>Git View</h4>
       <row>
        {nodes}
       </row>
       {status}
    </row>);
  }
});

magic.registerView({
  name: 'git',
  commands: [
     {
      name: "status",
      description: 'current git status',
      args: ['directory'],
      tags: ['show files', 'list files', 'display files', 'ls'],
      categories: ['read'],
      method: gitViewStore["status"]
    }
    ],
  category: 'git',
  component: GitComponent
});
