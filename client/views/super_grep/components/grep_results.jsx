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

/*
<div class="ui cards">
  <div class="card">
    <div class="content">
      <div class="header">Elliot Fu</div>
      <div class="description">
        Elliot Fu is a film-maker from New York.
      </div>
    </div>
  </div>
  <div class="card">
    <div class="content">
      <div class="header">Veronika Ossi</div>
      <div class="meta">Friend</div>
      <div class="description">
        Veronika Ossi is a set designer living in New York who enjoys kittens, music, and partying.
      </div>
    </div>
  </div>
  <div class="card">
    <div class="content">
      <div class="header">Jenny Hess</div>
      <div class="meta">Friend</div>
      <div class="description">
        Jenny is a student studying Media Management at the New School
      </div>
    </div>
  </div>
</div>
*/

module.exports = GrepResults;