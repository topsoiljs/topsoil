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

Magic.prototype.callCommand = function(command, args){
  masterStore.openView(command.view.component);
  var argsArray = args.trim().split(' ');
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

  var argsObj = {};
  _.each(command.args, function(el, ind){
    argsObj[el] = argsArray[ind];
  })
  return command.method(argsObj);
};

Magic.prototype.search = function(terms){
  var results = {
    arguments: null,
    suggestions: []
  };
  var search = terms;
  for(var i=0;i<terms.length;i++){
    if(terms[i] === ':'){
      results.arguments = [];
      search = terms.slice(0, i);
      results.arguments = terms.slice(i+1, terms.length);
      break;
    }
  };
  if(terms.length === 0){
    search = ' ';
  };
  var results;
  this._auto.get(search, function(sugs){
    results.suggestions = sugs;
  });

  return results;
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
