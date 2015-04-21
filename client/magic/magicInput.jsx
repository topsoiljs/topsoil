var MagicSuggestions = require("./magicSuggestions.jsx");
var eventBus = require("../eventBus.js");
var masterStore = require("../masterStore.js");
var magic = require("./magic.js");
var isKey = require('../utilities.js').isKey;
var _ = require("lodash");


/*
  Data:
  {
    inputArr: [cmd, args1, args2, args3],
    activeIndex: 0,
    isEditing: false
  }

  Logic:
  Actions:
    Arrow Keys

    Enter

    Click

    //For later.
    Drag


  How do things start?
  
  Just typing in the command.

  Then on is args mode display the args.
  
  - undefined to show the placeholder text.


*/


var MagicInput = React.createClass({
  getInitialState: function() {
    return {inputText: ""};
  },
  componentDidMount: function(){
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
        console.log("current command:", this.getCurrentCommand(), "current args:", this.getCurrentArgs());
        magic.callCommand(this.getCurrentCommand(), this.getCurrentArgs());
        this.setState({inputText: ""});

        //Maybe factor arguments mode into store?
        //Maybe not?
        masterStore.resetState();
        masterStore.setMagic({isArgumentsMode: false});
      } else {
        masterStore.setMagic({isArgumentsMode: true});
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
    //If we are typing arguments we don't need to be reseting the suggestions.
    if(!this.props.isArgumentsMode) {
      masterStore.setSuggestions(results.suggestions);

      //If we have typed the colon we are in arguments mode.
      if(_.contains(text, ":")) {
        masterStore.setMagic({isArgumentsMode: true});
      }
    } else {
      masterStore.setArguments(results.arguments);
    }

    // If arguments there, then set args suggestions
    if(_.isString(results.arguments)){
      var argsSug = magic.searchArgs(this.getCurrentCommand(), results.arguments);
      masterStore.setArgsSuggestions(argsSugs);
    }else{
      masterStore.setArgsSuggestions(null);
    }
  },
  render: function() {
    var bubbles = [];
    
    if(this.props.isArgumentsMode) {
      this.inputArr.forEach(function(input, ind) {
        bubbles.push(<Bubble text=input isActive=(this.props.activeArgument === ind)/>);
      });
    } else {
      bubbles.push(<Bubble text=this.state.inputArr[0] isActive=true/>);
    }
    

    return (
      <div className="row">
        <div className="sixteen wide column">
          <div className="ui input topsoilInputBox">
            <i className="fa fa-chevron-right f-icon fa-2x"></i>
            {bubbles}
            <input autoFocus placeholder="Search..." type="text" value={this.state.inputText} onChange={this.onChange} id="terminal" onKeyUp={this.handleInput}  onKeyDown={this.handleShortcut}/>
          </div>
        </div>
      </div>
    );
  }
});

/*
For reference
<span className="parentofmagicinputs">
  <input id="command" className="magicinputs" placeholder="start"></input>
  <input className="magicinputs args" placeholder="gulp"></input>
  <input className="magicinputs args" placeholder="build-all"></input>
</span>

$('.magicinputs').on('focus', function(e){
  $('.parentofmagicinputs').css('border-bottom', '3px solid #757575')
})

$('.magicinputs').on('focusout', function(e){
  $('.parentofmagicinputs').css('border-bottom', '1px solid #757575')
})
*/

module.exports = MagicInput;
