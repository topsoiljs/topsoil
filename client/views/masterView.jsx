

var MasterView = React.createClass({
  getInitialState: function() {
    return null;
  },
  componentDidMount: function() {
    eventBus.register("master", function() {
      this.setState(masterStore.getState());
    }.bind(this));
  },
  render: function() {
    if(this.state) {
      return (<div>
                <MagicInput/>
                <div class="main">
                  <this.state/>
                </div>
              </div>)
    } else {
      return (<div>
                <MagicInput/>
              </div>)
    }
  }
});


$(function(){
  React.render(<MasterView />, document.getElementById('app'));
})
