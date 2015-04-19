var masterStore = require("../masterStore.js");
var MagicInput = require("../magic/magicInput.jsx");
var MagicSuggestions = require("../magic/MagicSuggestions.jsx");
var eventBus = require("../eventBus.js");
var HubWorld = require("./hub_world/hub_world.jsx");
var magic = require("../magic/magic.js");

var MasterView = React.createClass({
  getInitialState: function() {
    return masterStore.getState();
  },
  componentDidMount: function() {
    eventBus.register("master", function() {
      this.setState(masterStore.getState());
    }.bind(this));

    masterStore.openView(HubWorld);
    //This ensures all of the commands are registered.
    //This is generally bad... There is a more sane place to put this, but I don't know yet...
    masterStore.setSuggestions(magic.getAllCommands());
  },
  render: function() {
    if(this.state.activeView) {
      return (<div className="ui grid">
                <div className="magicInput four wide column">
                  <MagicInput {...this.state.magicData}/>
                </div>
                <div className="main twelve wide column">
                  <this.state.activeView/>
                </div>
              </div>)
    } else {      
      return (<div className="ui grid">
                <div className="sixteen wide column">
                  <MagicInput {...this.state.magicData}/>
                </div>
              </div>)
    }
  }
});


$(function(){
  React.render(<MasterView />, document.getElementById('app'));
})
