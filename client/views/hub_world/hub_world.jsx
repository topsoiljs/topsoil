var magic = require("../../magic/magic.js");

var HubWorld = React.createClass({
  getInitialState: function() {
    return {views: magic.getViews()};
  },
  render: function() {
    return (
      <div>
        {this.state.views}
      </div>
    )
  }
});