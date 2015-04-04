var MagicSuggestions = React.createClass({
  render: function() {
    var nodes = [];
    this.props.suggestions.forEach(function(suggestion){
      nodes.push(
        <li>
          {suggestion.name} |
          {suggestion.description}
        </li>
        )
      nodes.push(
        <div></div>
      )
    })
    return (
      <div>
        {nodes}
      </div>
    );
  }
});
