// Temp setstate
var setSuggestions;
var currentSuggestions;
var passSuggestions = function(data){
  currentSuggestions = data;
  setSuggestions(data);
};
var MagicInput = React.createClass({
  handleInput: function(e){
    if (e.key === 'Enter') {
      var el = document.getElementById('terminal');
      var value = el.value;
      magic.callCommand(currentSuggestions.suggestions[0]);
      el.value = "";
      passSuggestions({suggestions:[]});
    }
  },
  onChange: function(e){
    var results = magic.search(e.target.value);
    passSuggestions({suggestions: results});
  },
  render: function() {
    return (
      <input onChange={this.onChange} id="terminal" onKeyUp={this.handleInput}/>
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
