var grepStore = require("../s_grep_store.js");


var charClasses = [
  {
    id:"dot",
    desc:"Matches any character except line breaks.",
    ext:" Equivalent to <code>[^\\n\\r]</code>.",
    example:[".", "glib jocks vex dwarves!"],
    token:".",
    regex: /./
  },
  {
    label:"match any",
    desc:"A character set that can be used to match any character, including line breaks."+
      "<p>An alternative is <code>[^]</code>, but it is not supported in all browsers.</p>",
    example:["[\\s\\S]", "glib jocks vex dwarves!"],
    token:"[\\s\\S]",
    regex: /[\s\S]/
  },
  {
    id:"word",
    desc:"Matches any word character (alphanumeric & underscore).",
    ext:" Only matches low-ascii characters (no accented or non-roman characters). Equivalent to <code>[A-Za-z0-9_]</code>",
    example:["\\w","bonjour, mon fr\u00E8re"],
    token:"\\w",
    regex: /\w/
  },
  {
    id:"notword",
    label: "not word",
    desc:"Matches any character that is not a word character (alphanumeric & underscore).",
    ext:" Equivalent to <code>[^A-Za-z0-9_]</code>",
    example:["\\W","bonjour, mon fr\u00E8re"],
    token:"\\W",
    regex: /\W/
  },
  {
    id:"digit",
    desc:"Matches any digit character (0-9).",
    ext:" Equivalent to <code>[0-9]</code>.",
    example:["\\d","+1-(444)-555-1234"],
    token:"\\d",
    regex: /\d/
  },
  {
    id:"notdigit",
    label: "not digit",
    desc:"Matches any character that is not a digit character (0-9).",
    ext:" Equivalent to <code>[^0-9]</code>.",
    example:["\\D","+1-(444)-555-1234"],
    token:"\\D",
    regex: /\D/
  },
  {
    id:"whitespace",
    desc:"Matches any whitespace character (spaces, tabs, line breaks).",
    example:["\\s", "glib jocks vex dwarves!"],
    token:"\\s",
    regex: /\s/
  },
  {
    id:"notwhitespace",
    label: "not whitespace",
    desc:"Matches any character that is not a whitespace character (spaces, tabs, line breaks).",
    example:["\\S", "glib jocks vex dwarves!"],
    token:"\\S",
    regex: /\S/
  }
];

var EditableText = React.createClass({
  checkCharacter: function(character) {
    var trueRegexSymbols = [];
    charClasses.forEach(function(charClass) {
      var matches = character.match(charClass.regex);
      if(matches) {
        trueRegexSymbols.push(charClass);
      }
    });
    
    return trueRegexSymbols;
  },
  getInitialState: function() {
    return {isEditing: false};
  },
  setEditable: function() {
    this.setState({isEditing: true});
  },
  unFocus: function() {
    this.setState({isEditing: false});
    grepStore.grep();
  },
  changeFunc: function(e) {
    grepStore.changeRegexSelection(e.target.value); 
  },
  processText: function(text) {
    var splitText;
    if(text) {
      splitText = text.split("");   
    } else {
      splitText = [];
    }

    var charClickEvent = function(index) {
      return function() {
        grepStore.setOption(index);
      }
    }

    var style = {};

    return splitText.map(function(character, ind) {

      if(ind === this.props.activeCharIndex) {
        style = {"background-color": "pink"}
      } else {
        style = {};
      }

      return (<span style={style} onClick={charClickEvent(ind)} className="regexEditor" id={ind}>{character}</span>);
    }, this);
  },
  clickSuggestion: function(suggestionText, activeInd, text) {
    return function() {
     var firstHalf = text.slice(0, activeInd);
     var secondHalf = text.slice(activeInd + 1, text.length);
     grepStore.changeRegexSelection(firstHalf + suggestionText + secondHalf);
    }
  },
  render: function() {
    var style = {display: "inline-block"};
    var options = [];
    var text = this.props.text;

    

    if(this.props.shouldDisplayOptions) {
      var characters = this.checkCharacter(text[this.props.activeCharIndex]);

      characters.forEach(function(character) {
        options.push(<span onClick={this.clickSuggestion(character.token, this.props.activeCharIndex, this.props.text)} className="grepSuggestionsBubble">{character.token}</span>);
      }, this);
    }

    if(this.state.isEditing) {
      return (
        <input className="regexInput grepBubble" style={style} onBlur={this.unFocus} onChange={this.changeFunc} type="text" value={this.props.text}></input>
      )
    } else {
      return (
        <div style={{display: "inline-block"}} >
          <span className="grepBubble" onDoubleClick={this.setEditable}>{this.processText(this.props.text)}</span>
          {options}
        </div>
      )  
    } 
  }
});

module.exports = EditableText;