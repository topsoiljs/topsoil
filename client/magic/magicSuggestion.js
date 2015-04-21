var MagicSuggestion = React.createClass({
  //These two possibilities can be combined with a boolean
  render: function() {
    var suggestion =  this.props.suggestion;
    if(this.props.active){
        return (
          <div>
            <div className="activeSuggestion magicSuggestion">
              <i className={"fa fa-" + suggestion.view.icon + " fa-lg icon"}></i>
              <span className="suggestionName">{suggestion.name.toUpperCase()}</span>
              <span className="suggestionDescription">{suggestion.description}</span>
              <span className="suggestionArguments">arguments: {this.props.args}</span>
            </div>
          </div>
        )
      }else{
        return (
          <div>
            <div className="magicSuggestion">
              <i className={"fa fa-" + suggestion.view.icon + " fa-lg icon"}></i>
              <span className="suggestionName">{suggestion.name.toUpperCase()}</span>
              <span className="suggestionDescription">{suggestion.description}</span>
            </div>
          </div>
        )
    }
  }
});

module.exports = MagicSuggestion;
