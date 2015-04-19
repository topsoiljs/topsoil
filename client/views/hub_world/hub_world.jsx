var magic = require("../../magic/magic.js");
var masterStore = require("../../masterStore.js");
var _ = require("lodash");

var colors = [
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#f1c40f",
  "#e67e22",
  "#e74c3c"
]

var HubWorld = React.createClass({
  getInitialState: function() {
    var views = magic.getViews();
    var viewNames = _.reduce(views, function(coll, val, viewName) {
      coll.push(viewName);
      return coll;
    }, []);
    
    return {viewNames: viewNames, views: views};
  },
  clickCB: function(viewName) {
    return function() {
      masterStore.openView(this.state.views[viewName].component);
    }.bind(this)
  },
  render: function() {
    var that = this;
    return (
      <div>
        <ul className="flex-container">
          {
            this.state.viewNames.map(function(viewName, ind) {

              var style = {background: colors[ind]};

              return (<li style={style} onClick={that.clickCB(viewName)} className="flex-item">{viewName}</li>)
            })
          }
        </ul>
      </div>
    )
  }
});

module.exports = HubWorld;