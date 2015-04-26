var MagicSuggestions = require("./magicSuggestions.jsx");
var eventBus = require("../eventBus.js");
var masterStore = require("../masterStore.js");
var magic = require("./magic.js");
var isKey = require('../utilities.js').isKey;
var _ = require("lodash");
var Bubble = require("./bubble.jsx");
var HiddenCanvas = require("./hiddenCanvas.jsx");
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
    $('.magicinputs').on('focus', function(e){
      $('.parentofmagicinputs').css('border-bottom', '3px solid #757575')
    })

    $('.magicinputs').on('focusout', function(e){
      $('.parentofmagicinputs').css('border-bottom', '1px solid #757575')
    })
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
    if (isKey(e, 'ENTER')) {
      var currentCommand = this.getCurrentCommand();
      console.log(currentCommand);
      if(currentCommand.args.length === 0) {
        magic.callCommand(currentCommand);
        masterStore.resetState();

      } else if(this.props.isArgumentsMode) {
        //This could be moved below?
        if(this.props.activeArgumentIndex === currentCommand.args.length) {
          magic.callCommand(this.getCurrentCommand(), _.rest(this.props.inputArr));
          masterStore.resetState();
        } else {
          masterStore.activeIndexRight();
        }
      } else {
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
    var currentCommand = this.getCurrentCommand();
    //I am putting in the whole input arr for the sake of autcomplete
    //I am passing a lot of state to bubble. REFACTOR!
    if(this.props.isArgumentsMode) {
      this.props.inputArr.forEach(function(input, ind) {
        bubbles.push(<Bubble {...input} inputArr={this.props.inputArr} currentCommand={currentCommand} isArg={ind > 0} isActive={this.props.activeArgumentIndex === ind}/>);
      }, this);
    } else {
      bubbles.push(<Bubble {...this.props.inputArr[0]} inputArr={this.props.inputArr} currentCommand={currentCommand} isArg={false} isActive={true}/>);
    }

    return (
      <div className="row magicInput">
        <div className="sixteen wide column">
          <HiddenCanvas/>
          <span className="topsoilInputBox" onKeyUp={this.handleInput}  onKeyDown={this.handleShortcut}>
            <span className="caret">&gt;</span>
            <span className="parentofmagicinputs">
              {bubbles}
            </span>
          </span>
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
