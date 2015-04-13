var SGrepEditor = React.createClass({
  render: function() {
    var splitRegex;
    if(this.props.regex) {
      splitRegex = this.props.regex.split("");   
    } else {
      splitRegex = [];
    }
    
    return (
      <p>
        Current Selection: 
        /{
           splitRegex.map(function(regexSymbol, ind) {
             return (<span className="regexEditor" id={ind}>{regexSymbol}</span>);
           })
          }/ 
      </p>
    )
  }
})