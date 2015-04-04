var MagicSuggestions = React.createClass({
  render: function() {
    var nodes = [];
    this.props.suggestions.forEach(function(suggestion){
      nodes.push(
        <li>
          <div className="collapsible-header"> {suggestion.name} </div>
          <div className="collapsible-body"><p>{suggestion.description}</p></div>
        </li>
        )
    })
    return (
      <ul className="collapsible" data-collapsible="accordion">
        {nodes}
      </ul>
    );
  }
});
