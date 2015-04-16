var masterStore = require("../masterStore.js");
function generateSuffixes(word){
  return _.range(word.length).reduce(function(sum, el){
    sum.push(word.slice(el))
    return sum;
  }, [])
};

var Magic = function(){
  this.views = {};
  this.commands = {};
  this._auto = new Bloodhound({
    name: 'magic',
    local: [],
    datumTokenizer: function(d){
      var tokens = _.reduce(d, function(sum, el){
        if(_.isString(el)){
          return sum.concat(generateSuffixes(el));
        }else if (_.isArray(el)){
          var sub = sum.concat(_.reduce(el, function(sum, word){
            return sum.concat(generateSuffixes(word))
          }, []));
          return sub;
        }else {
          return sum;
        }
      },[])
      return tokens;
    },
    queryTokenizer: function(q){
      return [q]
    }
  })
  this._auto.initialize();
};

Magic.prototype.registerView = function(viewObject){
  this.views[viewObject.name] = viewObject;
  // Index commands
  _.each(viewObject.commands, function(el){
    this._auto.add([el]);
    el.view = viewObject;
    this.commands[el.name] = el;
  }.bind(this))
};

Magic.prototype.callCommand = function(command, args){
  this._auto.get('t', function(sugs){
    console.log(sugs);
  });
  masterStore.openView(command.view.component);
  var argsObj = {};
  _.each(args, function(el, ind){
    argsObj[el] = args[ind];
  })
  return command.method(argsObj);
};

Magic.prototype.search = function(terms){
  if(terms === ''){
    return [];
  };
  var terms = terms.split(' ');
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

module.exports = new Magic();
