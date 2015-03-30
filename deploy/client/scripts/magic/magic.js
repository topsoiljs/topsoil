var _ = require('lodash');

var Magic = function(){
  this.views = {};
};

Magic.prototype.registerView = function(viewObject){
  this.views[viewObject.name] = viewObject;
};

Magic.prototype.callCommand = function(command){

};

Magic.prototype.searchCommand = function(terms){
  var results = [];
  // Brute force search for now
  _.each(this.views, function(view){
    view.commands.forEach(function(command){
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

// var test = new Magic();

// test.registerView({
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
//     }
//   ],
//   category: 'filesystem'
// });

// console.log(test.searchCommand('show'));
