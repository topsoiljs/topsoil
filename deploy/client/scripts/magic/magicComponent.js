// Temp setstate
var setSuggestions;

var MagicInput = React.createClass({displayName: "MagicInput",
  onChange: function(e){
    var results = magic.search(e.target.value);
    setSuggestions({suggestions: results});
  },
  render: function() {
    return (
      React.createElement("input", {onChange: this.onChange})
    );
  }
});

var MagicSuggestions = React.createClass({displayName: "MagicSuggestions",
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
        React.createElement("li", null, 
          suggestion.name, " |", 
          suggestion.description
        )
        )
      nodes.push(
        React.createElement("div", null)
      )
    })
    return (
      React.createElement("div", null, 
        nodes
      )
    );
  }
});

$(function(){
  var suggestions = React.render(React.createElement(MagicSuggestions, null), document.getElementById('suggestions'));
  var input = React.render(React.createElement(MagicInput, null), document.getElementById('input'));
})
