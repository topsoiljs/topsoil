var EventBus = function() {
  
  var events = {};

  var api = {
    register: function(view, listener) {
      events[view] = listener;
    },
    emit: function(view, data) {
      if(events[view]) {
        events[view](data);
      }
    }
  }

  return api;
}

var eventBus = EventBus();
  


/*
START DUMMY DATA
*/

function io(path) {
  return {
    emit: function() {

    },
    on: function(dummy, func) {
      func({data: ["deploy",
                   "client",
                   "tests",
                   "secret"]});
    }
  } 
}

var magic = {
  registerView: function() {

  }
}



/*
END DUMMY DATA
*/

function ViewStore() {
  var state = {files: []};
  var socket = io('/');

  var methods = {
    getFiles: function(dir){
          var UID = Math.random();
          socket.emit('fs.ls', {
            dir: dir,
            uid: UID
          });
          socket.on(UID, function(data){
            //data.err
            //data.data
            state.files = data.data;
            eventBus.emit('filesystem');
          })
    },
    getState: function() {
      return state;
    }
  }

  return methods;
}

var viewStore = ViewStore();

var FilesystemComponent = React.createClass({
  getInitialState: function() {
    return viewStore.getState();
  },
  componentDidMount: function() {
    eventBus.register("filesystem", function() {
      console.log(this);
      this.setState(viewStore.getState());
    }.bind(this));

    document.getElementById("show").onclick = function(e) {
      e.preventDefault();
      viewStore.getFiles();
    }
  },
  render: function() {
    
    var fileText = this.state.files.map(function(filename) {
      return (<p> {filename} </p>)
    });

    return (<div>
       Filesystem
       {fileText}
       <a id="show" href="">show files</a>
    </div>);
  }
});

React.render(<FilesystemComponent/>, document.getElementById('input'));

magic.registerView({
  name: 'filesystem',
  commands: [{
    getFiles: { 
      description: 'lists files in directory',
      args: 'directory',
      tags: ['show files', 'list files', 'display files'],
      categories: ['read'],
      method: viewStore["getFiles"]
    }
  }],
  category: 'filesystem',
  component: FilesystemComponent
});

