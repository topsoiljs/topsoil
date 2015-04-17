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
  masterStore.openView(command.view.component);
  var argsObj = {};
  _.each(args, function(el, ind){
    argsObj[el] = args[ind];
  })
  return command.method(argsObj);
};

Magic.prototype.search = function(terms){
  var results = {
    arguments: null,
    suggestions: []
  };
  if(terms === ''){
    return results;
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
  var results;
  this._auto.get(search, function(sugs){
    results.suggestions = sugs;
  });

  return results;
};

Magic.prototype.searchArgs = function(currentCommand, terms){
  console.log('searching args', currentCommand, terms);
  return [];
};

Magic.prototype.getViews = function() {
  return this.views;
};

module.exports = new Magic();
