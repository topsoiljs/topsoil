var MagicSuggestions = React.createClass({
  componentDidMount: function(){
    eventBus.register('suggestions', function(data){
      console.log(data, 'sug');
      this.setState({suggestions: data});
    }.bind(this))
  },
  getInitialState: function(){
    return {suggestions:[]};
  },
  render: function() {
    var nodes = [];
    this.state.suggestions.forEach(function(suggestion){
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
