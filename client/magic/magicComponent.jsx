// Temp setstate
// Crazy things happening here. Refactor later.
var setSuggestions;
var currentSuggestions;

// var MagicStore = function(){
//   var state = {
//     args: null,
//   };
//   return {
//     toggleArgs: function(){
//       state.args = !state.args;
//     },
//     getState: function(){
//       return state;
//     }
//   }
// };

// var magicStore = MagicStore();

var passSuggestions = function(data){
  currentSuggestions = data;
  setSuggestions(data);
};
var MagicInput = React.createClass({
  setInitialState: function(){
    return {
      args: null
      currentCommand: null
    }
  },
  handleInput: function(e){
    var el = document.getElementById('terminal');
    if (e.key === 'Enter') {
      if(!this.state.args && currentSuggestions.suggestions[0]){
        this.setState({
          args: [],
          currentCommand: currentSuggestions.suggestions[0]
        })
        passSuggestions({suggestions:[]});
      }else{
        args = value.split(' ').slice(1);
        magic.callCommand(currentSuggestions.suggestions[0], args);
        el.value = "";
        this.setState({
          args: null,
          currentCommand: null
        })
      }
    }
  },
  onChange: function(e){
    if(!this.state.args){
      var results = magic.search(e.target.value);
      passSuggestions({suggestions: results});
    }
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
