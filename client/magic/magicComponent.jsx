// Temp setstate
var setSuggestions;

var MagicInput = React.createClass({
  onChange: function(e){
    var results = magic.search(e.target.value);
    setSuggestions({suggestions: results});
  },
  render: function() {
    return (
      <input onChange={this.onChange} />
    );
  }
});

var MagicSuggestions = React.createClass({
  componentDidMount: function(){
    console.log('setting suggestions');
    setSuggestions = this.setState.bind(this);
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

$(function(){
  var suggestions = React.render(<MagicSuggestions />, document.getElementById('suggestions'));
  var input = React.render(<MagicInput />, document.getElementById('input'));
})
