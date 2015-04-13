var GrepResults = React.createClass({
  goToFile: function(filename) {
    return function(e) {
      e.preventDefault();
      grepStore._setFile(filename);
    }
  },
  render: function() {
    var that = this;

    return (
      <div className="results">
        {
         this.props.results.map(function(result) {
           return (<p>{result.line} [{result.filename} <a href="" onClick={that.goToFile(result.filename)}>{result.lineNum}</a>]</p>)   
         })
        }   
      </div>
    )
  }
})