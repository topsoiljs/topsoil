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
};

var magic = new Magic();
