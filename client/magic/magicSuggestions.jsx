var MagicSuggestions = React.createClass({
  render: function() {
    var nodes = [];
    this.props.suggestions.forEach(function(suggestion, ind){
      var sugNode;
      if(ind === this.props.suggestionActive){
        sugNode = (<li>
          <div className="collapsible-header active-item"> {suggestion.name} | {suggestion.description} | arguments: {JSON.stringify(suggestion.args).slice(1, -1)}</div>
        </li>)
      }else{
        sugNode = (<li>
          <div className="collapsible-header"> {suggestion.name} | {suggestion.description}</div>
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
