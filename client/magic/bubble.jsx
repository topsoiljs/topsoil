var masterStore = require("../masterStore.js");
var magic = require("./magic.js");
var isKey = require('../utilities.js').isKey;

var Bubble = React.createClass({
  clickFunc: function(e) {
    masterStore.setMagic({activeArgumentIndex: this.props.index});
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
    masterStore.setMagic({isArgumentsMode: false, inputArr: [{text: text, placeholder: "start", isArg: false, index: 0}]});

    var suggestions = magic.search(text);
    masterStore.setSuggestions(suggestions);
    
  },
  onArgChange: function(e) {
    var text = e.target.value;
    masterStore.setActiveArgumentText(text);    
    //Do stuff to get the argument suggestions
    /*
    if(_.isString(results.arguments)){
      var argsSug = magic.searchArgs(this.getCurrentCommand(), results.arguments);
      masterStore.setArgsSuggestions(argsSugs);
    }else{
      masterStore.setArgsSuggestions(null);
    } 
    */
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
    }
  },
  render: function() {
    var className = this.props.isArg ? "args" : "";
    var id = this.props.isArg ? "" : "command";
    var onChangeFunc = this.props.isArg ? this.onArgChange : this.onCommandChange;

    return (
      <input id={id}  
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
})

/*
<span className="parentofmagicinputs">
  <input id="command" className="magicinputs" placeholder="start"></input>
  <input className="magicinputs args" placeholder="gulp"></input>
  <input className="magicinputs args" placeholder="build-all"></input>
</span>
*/
module.exports = Bubble;