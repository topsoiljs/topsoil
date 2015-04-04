var Magic = function(){
  this.views = {};
};

Magic.prototype.registerView = function(viewObject){
  this.views[viewObject.name] = viewObject;
};

Magic.prototype.callCommand = function(command, args){
  for(var key in this.views){
    for(var j=0;j<this.views[key].commands.length;j++){
      if(this.views[key].commands[j].name === command.name){
        masterStore.openView(this.views[key].component);
        var argsObj = {};
        this.views[key].commands[j].args.forEach(function(el, ind){
          argsObj[el] = args[ind];
        })
        return this.views[key].commands[j].method(argsObj);
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
