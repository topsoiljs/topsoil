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
  var terms = terms.split(' ');
  console.log(terms);
  var results = [];
  // Brute force search for now
  _.each(this.views, function(view){
    view.commands.forEach(function(command){
      var descriptionMatch = true;
      for(var k=0;k<terms.length;k++){
        descriptionMatch = descriptionMatch && (command.description.indexOf(terms[k]) > -1);
      }
      if(descriptionMatch){
        results.push(command);
        return;
      }
      var nameMatch = true;
      for(var k=0;k<terms.length;k++){
        nameMatch = nameMatch && (command.name.indexOf(terms[k]) > -1);
      }
      if(nameMatch){
        results.push(command);
        return;
      };
      for(var i=0;i<command.tags.length;i++){
        var tagMatch = true;
        for(var k=0;k<terms.length;k++){
          tagMatch = tagMatch && (command.tags[i].indexOf(terms[k]) > -1);
        }
        if(tagMatch){
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
