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
  this.views.forEach(function(view){
    view.commands.forEach(function(command){
      if(command.name.indexOf(term) > -1){
        results.push(command);
        return;
      };
      for(var i=0;i<command.tags.length;i++){
        if(command.tags[i].indexOf(term) > -1){
          results.push(command);
          return;
        }
      }
    })
  });

  return results;
};



