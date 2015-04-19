var MagicSuggestions = require("./magicSuggestions.jsx");
var eventBus = require("../eventBus.js");
var masterStore = require("../masterStore.js");
var magic = require("./magic.js");
var isKey = require('../utilities.js').isKey;
var _ = require("lodash");

var MagicInput = React.createClass({
  getInitialState: function() {
    return {inputText: ""};
  },
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
      if(this.props.isArgumentsMode) {
        magic.callCommand(this.getCurrentCommand(), this.getCurrentArgs());
        this.setState({inputText: ""});

        //Maybe factor arguments mode into store?
        //Maybe not?
        masterStore.resetState();  
        masterStore.setMagic({isArgumentsMode: false});
      } else {
        this.setState({inputText: this.state.inputText + ":"});
      }
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

    var text = e.target.value;
    var results = magic.search(text);
    this.setState({inputText: text});

    if(_.contains(text, ":")) {
      masterStore.setMagic({isArgumentsMode: true});
    }


    //console.log("results: ", results);
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
    return (
      <div>
        <div className="row">
          <div className="input-field col s12">
            <i className="mdi-hardware-keyboard-arrow-right prefix"></i>
            <input autoFocus type="text" value={this.state.inputText} onChange={this.onChange} id="terminal" onKeyUp={this.handleInput}  onKeyDown={this.handleShortcut}/>
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
