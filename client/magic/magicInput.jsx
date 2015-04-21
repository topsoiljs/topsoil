var MagicSuggestions = require("./magicSuggestions.jsx");
var eventBus = require("../eventBus.js");
var masterStore = require("../masterStore.js");
var magic = require("./magic.js");
var isKey = require('../utilities.js').isKey;
var _ = require("lodash");
var Bubble = require("./bubble.jsx");

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
    return {};
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
    } else if(isKey(e, 'RIGHT_ARROW')) {

    } else if(isKey(e, 'LEFT_ARROW')) {

    }
  },
  handleInput: function(e){
    var el = document.getElementById('terminal');
    if (isKey(e, 'ENTER')) {

      var currentCommand = this.getCurrentCommand();
      if(currentCommand.args.length === 0) {
        magic.callCommand(currentCommand);

        masterStore.resetState();

      } else if(this.props.isArgumentsMode) {
        magic.callCommand(this.getCurrentCommand(), _.rest(this.props.inputArr));
        //Maybe factor arguments mode into store?
        //Maybe not?
        masterStore.resetState();
      } else {
        //consider replacing args mode with some pointer to the active suggestion.
        masterStore.enterArgsMode();
      }
    }
  },
  getCurrentCommand: function(){
    return this.props.suggestions[this.props.suggestionActive];
  },
  getCurrentArgsSuggestion: function(){
    if(this.props.suggestionArgsActive < 0){
      return this.props.args;
    }else{
      var currentArgs = this.props.argsSuggestions[this.props.suggestionArgsActive].name;
      return currentArgs === undefined ? this.props.args : currentArgs;
    }
  },
  render: function() {
    var bubbles = [];
    //Data is {text:, placeholder:, isArg:}
    // console.log("this is what I know in render:", this.props);

    if(this.props.isArgumentsMode) {
      this.props.inputArr.forEach(function(input, ind) {
        bubbles.push(<Bubble {...input} isArg={ind > 0} isActive={this.props.activeArgumentIndex === ind}/>);
      }, this);
    } else {
      bubbles.push(<Bubble {...this.props.inputArr[0]} isArg={false} isActive={true}/>);
    }

    return (
      <div className="row">
        <div className="sixteen wide column">
          <div className="ui input topsoilInputBox" onKeyUp={this.handleInput}  onKeyDown={this.handleShortcut}>
            <i className="fa fa-chevron-right f-icon fa-2x"></i>
            {bubbles}
          </div>
        </div>
      </div>
    );
  }
});

/*
For reference
<input autoFocus placeholder="Search..." type="text" value={this.state.inputText} onChange={this.onChange} id="terminal" />



$('.magicinputs').on('focus', function(e){
  $('.parentofmagicinputs').css('border-bottom', '3px solid #757575')
})

$('.magicinputs').on('focusout', function(e){
  $('.parentofmagicinputs').css('border-bottom', '1px solid #757575')
})
*/

module.exports = MagicInput;
