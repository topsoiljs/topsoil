//Suggestions should handle key press events.


var MagicSuggestions = React.createClass({ 
  handleShortcut: function(e){
    // Tab or down
    var state = masterStore.getState();
    if(isKey(e, 'TAB', 'DOWN_ARROW')){
      e.preventDefault();
      masterStore.setActiveSuggestion((state.suggestionActive + 1) % state.suggestions.length)
    // Up
    }else if(isKey(e, 'UP_ARROW')){
      e.preventDefault();
      var active = (state.suggestionActive - 1) % state.suggestions.length;
      if(active < 0){
        active = state.suggestions.length-1;
      }
      masterStore.setActiveSuggestion(active);
    }
  },
  render: function() {
    var nodes = [];
    var iterable = this.props.argsSuggestions ? this.props.argsSuggestions : this.props.suggestions;
    var active = this.props.argsSuggestions ? this.props.suggestionArgsActive : this.props.suggestionActive
    iterable.forEach(function(suggestion, ind){
      // Replace later
      var args = this.props.argsSuggestions ? ['random args'] : JSON.stringify(suggestion.args).slice(1, -1)
      var sugNode;
      if(ind === active){
        sugNode = (<li>
          <div className="activeSuggestion"> 
            <i className={"fa fa-" + suggestion.view.icon + " fa-lg icon"}></i> 
            <span className="suggestionName">{suggestion.name.toUpperCase()}</span> 
            <span className="suggestionDescription">{suggestion.description}</span>  
            <span className="suggestionArguments">arguments: {JSON.stringify(suggestion.args).slice(1, -1)}</span>
          </div>
        </li>)
      }else{
        sugNode = (<li>
          <div className=""> 
            <i className={"fa fa-" + suggestion.view.icon + " fa-lg icon"}></i> 
            <span className="suggestionName">{suggestion.name.toUpperCase()}</span> 
            <span className="suggestionDescription">{suggestion.description}</span>
          </div>
        </li>)
      }
      nodes.push(sugNode);
    }.bind(this))
    return (
      <ul className="collection" data-collapsible="accordion">
        {nodes}
      </ul>
    );
  }
});

module.exports = MagicSuggestions;
