var SubViews = React.createClass({
  render: function(){
    var nodes = [];
    var nodes = this.props.subviews.map(function(El){
      return (
        <El/>
      )
    });
    return (
      <div className="subviews">{nodes}</div>
    )
  }
});

module.exports = SubViews;
