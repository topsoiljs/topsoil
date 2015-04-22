var masterStore = require("../masterStore");

var MagicInput = React.createClass({
  componentDidMount: function(){
    var canvasDom = React.findDOMNode(this.refs["hiddenCanvas"]);
    var ctx = canvasDom.getContext("2d");
    ctx.font="10px Lato";
    console.log(ctx);
    masterStore.setCTX(ctx);
  },
  render: function() {
    var style = {display: "none"};
    return (<canvas style={style} ref="hiddenCanvas"></canvas>)
  }
});

module.exports = MagicInput;