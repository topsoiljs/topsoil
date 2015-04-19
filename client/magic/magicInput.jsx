var MagicSuggestions = require("./magicSuggestions.jsx");
var eventBus = require("../eventBus.js");
var masterStore = require("../masterStore.js");
var magic = require("./magic.js");
var isKey = require('../utilities.js').isKey;


var MagicInput = React.createClass({
  componentDidMount: function(){
    masterStore.setSuggestions(magic.getAllCommands());
  },
  handleShortcut: function(e){
    // Tab or down
    if(isKey(e, 'TAB', 'DOWN_ARROW')){
      e.preventDefault();
      masterStore.activeSuggestionDown();
    // Up
    }else if(isKey(e, 'UP_ARROW')){
      e.preventDefault();
      masterStore.activeSuggestionUp();
    }
  },
  handleInput: function(e){
    var el = document.getElementById('terminal');

    if (isKey(e, 'ENTER')) {
      magic.callCommand(this.getCurrentCommand(), this.getCurrentArgs());
      el.value = '';
      masterStore.resetState();
    }
  },
  getCurrentCommand: function(){
    return this.props.suggestions[this.props.suggestionActive];
  },
  getCurrentArgs: function(){
    if(this.props.suggestionArgsActive < 0){
      return this.props.args;
    }else{
      var currentArgs = this.props.argsSuggestions[this.props.suggestionArgsActive].name;
      return currentArgs === undefined ? this.props.args : currentArgs;
    }
  },
  onChange: function(e){
    /*
      results = {
        suggestions: []commands
        arguments: []string
      }
    */
    var results = magic.search(e.target.value);
    // console.log("results: ", results);
    //Maybe make a general set method?
    masterStore.setSuggestions(results.suggestions);
    masterStore.setArguments(results.arguments);
    // If arguments there, then set args suggestions
    if(_.isString(results.arguments)){
      var argsSugs = magic.searchArgs(this.getCurrentCommand(), results.arguments);
      masterStore.setArgsSuggestions(argsSugs);
    }else{
      masterStore.setArgsSuggestions(null);
    }
  },
  render: function() {
    // console.log("magicInput Props:", this.props);
    return (
      <div>
        <div className="row">
          <div className="input-field col s12">
            <i className="mdi-hardware-keyboard-arrow-right prefix"></i>
            <input autoFocus type="text" onChange={this.onChange} id="terminal" onKeyUp={this.handleInput}  onKeyDown={this.handleShortcut}/>
          </div>
        </div>
        <div className="row">
          <MagicSuggestions {...this.props}/>
        </div>
      </div>
    );
  }
});

module.exports = MagicInput;
