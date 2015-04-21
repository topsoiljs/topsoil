var SubViews = React.createClass({
  render: function(){
    var nodes = [];
    // nodes.push(
    //   <div>branch: dev | changes: 3 lines</div>
    // )
    for(var i=0;i<8;i++){
      console.log(nodes);
      nodes.push(
        <div className="subview">branch: dev | changes: 3 lines</div>
      )
    }
    return (
      <div className="subviews">{nodes}</div>
    )
  }
});

module.exports = SubViews;
