var MasterView = React.createClass({
  getInitialState: function() {
    return {activeView: null};
  },
  componentDidMount: function() {
    eventBus.register("master", function() {
      this.setState({activeView: masterStore.getState()});
    }.bind(this));
  },
  render: function() {
    if(this.state.activeView) {

      return (<div className="row">
                <div className="magicInput col s4">
                  <MagicInput/>
                </div>
                <div className="main col s8">
                  <this.state.activeView/>
                </div>
              </div>)
    } else {
      return (<div>
                <div className="row">
                  <MagicInput/>
                </div>
              </div>)
    }
  }
});


$(function(){
  React.render(<MasterView />, document.getElementById('app'));
})
