var grepStore = require("../s_grep_store.js")
var _ = require("lodash");

var GrepResults = React.createClass({
  goToFile: function(filename) {
    return function(e) {
      e.preventDefault();
      grepStore._setFile(filename);
    }
  },
  stripFolders: function(str) {
    return _.last(str.split("/"));
  },
  render: function() {
    var that = this;

    return (
      <div className="grepResults">
        <div className="ui cards">
          {
           this.props.results.map(function(result) {
             return (
              <div className="card">
                <div className="content">
                  <div className="header">{that.stripFolders(result.filename)} [<a href="" onClick={that.goToFile(result.filename)}>{result.lineNum}</a>]</div>
                  <div className="description">
                    {result.line}
                  </div>
                </div>
              </div>
              )   
           })
          }   
        </div>
      </div>
    )
  }
})

module.exports = GrepResults;