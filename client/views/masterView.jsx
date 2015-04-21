var masterStore = require("../masterStore.js");
var MagicInput = require("../magic/magicInput.jsx");
var MagicSuggestions = require("../magic/MagicSuggestions.jsx");
var eventBus = require("../eventBus.js");
var HubWorld = require("./hub_world/hub_world.jsx");
var magic = require("../magic/magic.js");
var MagicInput = require("../magic/MagicInput.jsx");

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
    masterStore.setDefaultSuggestions(magic.getAllCommands());
  },
  // Need to add
  /*
    <i className="fa fa-chevron-right"></i>
  */
  render: function() {
    //Combine these two worlds...
    if(this.state.activeView === HubWorld) {
      return (<div className="ui grid">
                <div className="four wide column">
                  <MagicInput {...this.state.magicData}/>
                  <MagicSuggestions {...this.state.magicData}/>
                </div>
                <div className="main twelve wide column">
                  <this.state.activeView/>
                </div>
              </div>)
    } else if(this.state.activeView) {
      return (<div className="ui grid">
                <div className="row">
                  <div className="four wide column">
                    <MagicInput {...this.state.magicData}/>
                  </div>
                  <div className="subviews twelve wide column">
                    <h1>SUBVIEWS</h1>
                  </div>
                </div>
                <div className="row">
                  <div className="four wide column">
                    <MagicSuggestions {...this.state.magicData}/>
                  </div>
                  <div className="main twelve wide column">
                    <this.state.activeView/>
                  </div>
                </div>
              </div>)
    } else {
      //This is to handle our initial case of having no component. This is a little bit hacky. Consider a refactor.
      return (<div></div>)
    }
  }
});


$(function(){
  React.render(<MasterView />, document.getElementById('app'));
})
