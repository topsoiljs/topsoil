var Magic = function(){
  this.views = {};
};

Magic.prototype.registerView = function(viewObject){
  this.views[viewObject.name] = viewObject;
};

Magic.prototype.callCommand = function(command){
  for(var key in this.views){
    for(var j=0;j<this.views[key].commands.length;j++){
      // console.log(this.views[i].commands[j].name, command.name);
      if(this.views[key].commands[j].name === command.name){
        masterStore.openView(this.views[key].component);
        return this.views[key].commands[j].method();
      }
    }
  }
};

Magic.prototype.search = function(terms){
  if(terms === ''){
    return [];
  };

  var results = [];
  // Brute force search for now
  _.each(this.views, function(view){
    view.commands.forEach(function(command){
      if(command.description.indexOf(terms) > -1){
        results.push(command);
        return;
      }
      if(command.name.indexOf(terms) > -1){
        results.push(command);
        return;
      };
      for(var i=0;i<command.tags.length;i++){
        if(command.tags[i].indexOf(terms) > -1){
          results.push(command);
          return;
        }
      }
    })
  });

  return results;
};

Magic.prototype.getViews = function() {
  return this.views;
}

var magic = new Magic();

// magic.registerView({
//   name: 'filesystem',
//   commands: [
//     {
//       name: 'getFiles',
//       description: 'lists files in directory',
//       args: 'directory',
//       tags: ['show files', 'list files', 'display files'],
//       categories: ['read'],
//       method: function(dir){
//       }
//     },
//     {
//       name: 'readFile',
//       description: 'reads a file',
//       args: 'file',
//       tags: ['read file', 'see file', 'view file'],
//       categories: ['read'],
//       method: function(dir){
//       }
//     }
//   ],
//   category: 'filesystem'
// });

// for(var i=0;i<100;i++){
//   var obj = {
//     name: Math.random().toString(36),
//     commands: [
//       {
//         name: Math.random().toString(36),
//         description: Math.random().toString(),
//         tags: [Math.random().toString(), Math.random().toString()],
//         categories: ['write'],
//         method: function(){
//           console.log(this.name);
//         }
//       }
//     ]
//   };
//   for(var j=0;j<100;j++){
//     obj.name += Math.toString(36);
//     obj.commands[0].name += Math.toString(36);
//   }
//   magic.registerView(obj)
// }

// console.log(test.search('show'));

// Temp setstate
var setSuggestions;
var currentSuggestions;
var passSuggestions = function(data){
  currentSuggestions = data;
  setSuggestions(data);
};
var MagicInput = React.createClass({displayName: "MagicInput",
  handleInput: function(e){
    if (e.key === 'Enter') {
      var el = document.getElementById('terminal');
      var value = el.value;
      magic.callCommand(currentSuggestions.suggestions[0]);
      el.value = "";
      passSuggestions({suggestions:[]});
    }
  },
  onChange: function(e){
    var results = magic.search(e.target.value);
    passSuggestions({suggestions: results});
  },
  render: function() {
    return (
      React.createElement("input", {onChange: this.onChange, id: "terminal", onKeyUp: this.handleInput})
    );
  }
});

var MagicSuggestions = React.createClass({displayName: "MagicSuggestions",
  componentDidMount: function(){
    console.log('setting suggestions');
    setSuggestions = this.setState.bind(this);
  },
  getInitialState: function(){
    return {suggestions:[]};
  },
  render: function() {
    var nodes = [];
    this.state.suggestions.forEach(function(suggestion){
      nodes.push(
        React.createElement("li", null, 
          suggestion.name, " |", 
          suggestion.description
        )
        )
      nodes.push(
        React.createElement("div", null)
      )
    })
    return (
      React.createElement("div", null, 
        nodes
      )
    );
  }
});

$(function(){
  var suggestions = React.render(React.createElement(MagicSuggestions, null), document.getElementById('suggestions'));
  var input = React.render(React.createElement(MagicInput, null), document.getElementById('input'));
})



var MasterView = React.createClass({displayName: "MasterView",
  getInitialState: function() {
    return {activeComponent: null, views: magic.getViews()}
  },
  componentDidMount: function() {
  },
  render: function() {
    if(this.state.activeComponent) {
      return (React.createElement("div", null, 
                React.createElement(MagicInput, null), 
                React.createElement("div", {class: "main"}, 
                  React.createElement(this.state.activeComponent, null)
                )
      ))
    } else {
      return (React.createElement("div", null, 
                React.createElement(MagicInput, null)
              ))
    }
  }
});
$(function(){
  React.render(React.createElement(MasterView, null), document.getElementById('app'));
})

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

// function io(path) {
//   return {
//     emit: function() {

//     },
//     on: function(dummy, func) {
//       func({data: ["deploy",
//                    "client",
//                    "tests",
//                    "secret"]});
//     }
//   }
// }

/*
END DUMMY DATA
*/

function ViewStore() {
  var state = {files: []};
  var socket = io();

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
    hideFiles: function(){
      console.log('hidefiles');
      state.files = [];
      eventBus.emit('filesystem');
    },
    renderView: function(){
      React.render(React.createElement(FilesystemComponent, null), document.getElementById('test'));
    },
    getState: function() {
      return state;
    }
  }

  return methods;
}

var viewStore = ViewStore();

var FilesystemComponent = React.createClass({displayName: "FilesystemComponent",
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
      return (React.createElement("p", null, " ", filename, " "))
    });

    return (React.createElement("div", null, 
       "Filesystem", 
       fileText, 
       React.createElement("a", {id: "show", href: ""}, "show files")
    ));
  }
});


magic.registerView({
  name: 'filesystem',
  commands: [
     {
      name: "getFiles",
      description: 'lists files in directory',
      args: 'directory',
      tags: ['show files', 'list files', 'display files'],
      categories: ['read'],
      method: viewStore["getFiles"]
    },
    {
      name: "hideFiles",
      description: 'hides files in directory view',
      args: 'directory',
      tags: ['hide files', 'remove fileview', "don't display files"],
      categories: ['ui'],
      method: viewStore["hideFiles"]
    },
    {
      name: "renderFilesystem",
      description: 'renders fileSystemView',
      args: 'directory',
      tags: ['show filesystem view'],
      categories: ['ui'],
      method: viewStore["renderView"]
    }
    ],
  category: 'filesystem',
  component: FilesystemComponent
});

