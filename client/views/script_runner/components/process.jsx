var ProcessComponent = React.createClass({
  handleClick: function(){

  },
  render: function(){
    var nodesOne = _.reduceRight(this.props.proc.output, function(total, current){
      total.push((<div>{current}</div>));
      return total;
    }, []);
    return (
        <div className="process card">
          <div className="content">
            <div className="header">{this.props.proc.command} | {this.props.proc.args}</div>
            <div className="ui tiny icon buttons">
              <div className="ui basic button" onClick={this.handleClick}>
                <i className="remove icon"></i>
              </div>
            </div>
            <div className="description">
              {nodesOne}
            </div>
          </div>
        </div>)
  }
})

module.exports = ProcessComponent;
