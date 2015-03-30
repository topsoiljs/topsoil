var MagicInput = React.createClass({
  onChange: function(e){
    var results = Magic.search(e.target.value);
    MagicSuggestions.setState({suggestions: results});
  },
  render: function() {
    return <input onChange={this.onChange}>
  }
});

var MagicSuggestions = React.createClass({
  getInitialState: function(){
    return {suggestions:[]};
  },
  render: function() {
    var nodes = [];
    this.state.forEach(function(suggestion){
      nodes.push(
        <div>
          {suggestion.name}
          {suggestion.description}
        </div>
        )
    })
    return
  }
});

var suggestions = React.render(<MagicSuggestions />, document.getElementById('suggestions'));
var input = React.render(<MagicInput />, document.getElementById('input'));
