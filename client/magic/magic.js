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
  if(terms === ''){
    return [];
  };
  var results;
  this._auto.get(terms, function(sugs){
    results = sugs;
  });

  return results;
};

Magic.prototype.getViews = function() {
  return this.views;
};

module.exports = new Magic();
