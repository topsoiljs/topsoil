

var MasterView = React.createClass({
  getInitialState: function() {
    return {activeComponent: null, views: magic.getViews()}
  },
  componentDidMount: function() {
  },
  render: function() {
    if(this.state.activeComponent) {
      return (<div>
                <MagicInput/>
                <MagicSuggestions/>
                <div class="main">
                  <this.state.activeComponent/>
                </div>
      </div>)
    } else {
      return (<div>
                <MagicInput/>
                <MagicSuggestions/>
              </div>)
    }
  }
});
$(function(){
  React.render(<MasterView />, document.getElementById('app'));
})
