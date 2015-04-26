var masterStore = require("../masterStore.js");
var magic = require("./magic.js");
var isKey = require('../utilities.js').isKey;

var Bubble = React.createClass({
  getInitialState: function() {
    return {width: 10, baseSize: 0, padding: 0};
  },
  componentDidMount: function() {
    //This working relies on the canvas being mounted first.
    //Consider refactoring so these are not coupled.
    //That might be impossible... :,(
    if(this.props.isArg) {
      var padding = 25;
    } else {
      var padding = 20;
    }
    var baseWidth = masterStore.getTextSize(this.props.placeholder);
    this.setState({baseSize: baseWidth, width: baseWidth + padding, padding: padding});
  },
  clickFunc: function(e) {
    masterStore.setMagic({activeArgumentIndex: this.props.index});
  },
  changeSize: function(text) {
    var width = Math.max(masterStore.getTextSize(text), this.state.baseSize);

    if(width) {
      this.setState({width: width + this.state.padding});
    }
  },
  onCommandChange: function(e){
    /*
      results = {
        suggestions: []commands
        arguments: []string
      }
      Need to further seperate args from suggestions.
      only put this on
    */
    var text = e.target.value;
    this.changeSize(text);
    masterStore.setMagic({isArgumentsMode: false, inputArr: [{text: text, placeholder: "start", isArg: false, index: 0}]});

    var suggestions = magic.search(text);
    masterStore.setSuggestions(suggestions);

  },
  onArgChange: function(e) {
    var inputArr = this.props.inputArr;
    var text = e.target.value;
    this.changeSize(text);
    masterStore.setActiveArgumentText(text);
    //Do stuff to get the argument suggestions
    var argsSug = magic.searchArgs(this.props.currentCommand, _.pluck(_.rest(inputArr), "text"));
    masterStore.setArgsSuggestions(argsSug);
  },
  componentDidUpdate: function(nextProps) {
    var refKey = this.props.placeholder;
    var domNode = React.findDOMNode(this.refs[refKey]);
    if(this.props.isActive) {
      //This should set the next input to be focused, but it does not. I don't know why.
      domNode.focus();
    }
  },
  keyPressFunc: function(e) {
    var lastCursorPosition = e.target.selectionEnd;
    if(isKey(e, "RIGHT_ARROW") && lastCursorPosition === this.props.text.length) {
      masterStore.activeIndexRight();
    } else if(isKey(e, "LEFT_ARROW") && lastCursorPosition === 0) {
      masterStore.activeIndexLeft();
    } else if(isKey(e, "BACKSPACE") && lastCursorPosition === 0) {
      masterStore.activeIndexLeft();
    }
  },
  render: function() {
    var className = this.props.isArg ? "args" : "";
    var id = this.props.isArg ? "" : "command";
    var onChangeFunc = this.props.isArg ? this.onArgChange : this.onCommandChange;

    var style = {width: this.state.width + "px"};
    return (
     <input id={id}
            style={style}
            className={"magicinputs " + className}
            placeholder={this.props.placeholder}
            onChange={onChangeFunc}
            onClick={this.clickFunc}
            onKeyUp={this.keyPressFunc}
            value={this.props.text}
            ref={this.props.placeholder}>
     </input>
    )
  }
});

module.exports = Bubble;
