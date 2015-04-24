var masterStore = require("../masterStore.js");

function generateSuffixes(word){
  var subResults = _.range(word.length).reduce(function(sum, el){
    sum.push(word.slice(el));
    return sum;
  }, []);
  subResults.push(' ');
  return subResults;
};

var Magic = function(){
  this.views = {};
  this.commands = {};
  this.subViews = [];
  // Start args search engine
  this._argsEngines = {};

  // Start core commands search engine
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
      return q.split(' ');
    },
    limit: 12
  })
  this._auto.initialize();
};

Magic.prototype.getSubViews = function(){
  return this.subViews;
};

Magic.prototype.registerSubView = function(viewObject){
  this.subViews.push(viewObject);
};

Magic.prototype.registerView = function(viewObject){
  this.views[viewObject.name] = viewObject;
  // Index commands
  _.each(viewObject.commands, function(el){
    el._id = uuid.v4();
    this._argsEngines[el._id] = new Bloodhound({
      name: el._id,
      local: [],
      datumTokenizer: function(d){
        return generateSuffixes(d.name);
      },
      queryTokenizer: function(q){
        return q;
      },
      sorter: function(a, b){
        return b.priority - a.priority;
      },
      limit: 12
    });
    this._auto.add([el]);
    el.view = viewObject;
    this.commands[el.name] = el;
  }.bind(this))
};

Magic.prototype.callCommand = function(command, userArgs){
  // Check if view has specified no autorender, or render command explicitly called.
  if(!command.view.noAutoRender || command.render){
    masterStore.openView(command.view.component);
  }
  //This will probably have to change.
  //I need to re read it to understand it.

  /*
  if(args) {
    _.defaults(command, {argsHistory: {}});
    if(!command.argsHistory[args]){
      var argsObj = {
        name: args,
        priority: 0
      };
      command.argsHistory[args] = argsObj;
      this._argsEngines[command._id].add([argsObj]);
    };
    command.argsHistory[args].priority ++;
  }
  Need to loop over each of the args to give each one auto complete
  */
  var argsObj = {};
  _.each(command.args, function(el, ind){
    argsObj[el] = userArgs[ind].text;
  });

  console.log(argsObj);
  return command.method(argsObj);
};

//This is not good perf. Need to refactor.
Magic.prototype.getAllCommands = function() {
  var commands = this.commands
  var result = [];
  for(var key in commands) {
    result.push(commands[key]);
  }

  return result;
}

Magic.prototype.search = function(search){
  var suggestions;

  function isAllSpaces(str) {
    for(var i = 0; i < str.length; i++) {
      if(str[i] !== " ") {
        return false;
      }
    }

    if(str === "") {
      return false;
    } else {
      return true;
    }
  }

  if(!isAllSpaces(search)) {
    this._auto.get(search, function(sugs){
      suggestions = sugs;
    });
  } else {
    suggestions = this.getAllCommands();
  }


  return suggestions;
};

Magic.prototype.searchArgs = function(currentCommand, terms){
  if(terms.length === 0){
    terms = ' ';
  };
  var results;
  this._argsEngines[currentCommand._id].get(terms, function(sugs){
    results = sugs;
  });

  return results;
};

Magic.prototype.getViews = function() {
  return this.views;
};

module.exports = new Magic();
