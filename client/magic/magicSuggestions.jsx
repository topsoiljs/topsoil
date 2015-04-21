//Suggestions should handle key press events.
var MagicSuggestion = require("./magicSuggestion.js");

var MagicSuggestions = React.createClass({
  render: function() {
    var nodes = [];
    var iterable;
    var active;
    var activeCommand = "";
    
    if(this.props.isArgumentsMode) {
      var activeSuggestion = this.props.suggestions[this.props.suggestionActive];
      activeCommand = (<MagicSuggestion suggestion={activeSuggestion} active={false}/>);
    }

    if(this.props.argsSuggestions && this.props.isArgumentsMode) {
      iterable = this.props.argsSuggestions;
      active = this.props.suggestionArgsActive;
    } else {
      iterable = this.props.suggestions;
      active = this.props.suggestionActive;
    }

    iterable.forEach(function(suggestion, ind){
      suggestion.view = suggestion.view || {};
      // Replace later
      var args = this.props.argsSuggestions ? ['random args'] : JSON.stringify(suggestion.args).slice(1, -1)
      var sugNode = (<MagicSuggestion suggestion={suggestion} active={active === ind} args={args}/>);
      nodes.push(sugNode);
    }.bind(this));

    return (
      <ul className="collection" data-collapsible="accordion">
        {activeCommand}
        {nodes}
      </ul>
    );
  }
});

module.exports = MagicSuggestions;
