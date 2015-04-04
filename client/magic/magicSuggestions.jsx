var MagicSuggestions = React.createClass({
  render: function() {
    var nodes = [];
    this.props.suggestions.forEach(function(suggestion){
      var sugNode;
      if(suggestion.selected){
        console.log(suggestion);
        sugNode = (<li>
          <div className="collapsible-header active-item"> {suggestion.name} | {suggestion.description} | arguments: {JSON.stringify(suggestion.args).slice(1, -1)}</div>
        </li>)
      }else{
        sugNode = (<li>
          <div className="collapsible-header"> {suggestion.name} | {suggestion.description}</div>
        </li>)
      }
      nodes.push(sugNode);
    })
    return (
      <ul className="collection" data-collapsible="accordion">
        {nodes}
      </ul>
    );
  }
});
