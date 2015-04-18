var MagicSuggestions = React.createClass({
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
          <div className="collapsible-header active-item"> {suggestion.name} | {suggestion.description} | arguments: {args}</div>
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

module.exports = MagicSuggestions;
