var masterStore = require("../masterStore.js");
var MagicInput = require("../magic/magicInput.jsx");
var MagicSuggestions = require("../magic/magicSuggestions.jsx");
var eventBus = require("../eventBus.js");
var HubWorld = require("./hub_world/hub_world.jsx");
var magic = require("../magic/magic.js");
var SubViews = require("./subViews.jsx");

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
    masterStore.initializeSubViews(magic.getSubViews());

    // Ask for notifications permissions
    Notification.requestPermission( function(status) {
      log.info('permissions', status);
    });

    log.setLevel(0);
  },
  render: function() {
    //Combine these two worlds...
    var subviews = this.state.magicData.subviews ? this.state.magicData.subviews.map(function(el){
      return el.component;
    }) : [];
    if(this.state.activeView === HubWorld) {
      return (<div className="ui grid">
                <div className="four wide column">
                  <MagicInput {...this.state.magicData}/>
                  <MagicSuggestions {...this.state.magicData}/>
                </div>
                <div className="main twelve wide column">
                  <SubViews subviews={subviews}/>
                  <this.state.activeView/>
                </div>
              </div>)
    } else if(this.state.activeView) {
      return (<div className="ui grid">
                <div className="row">
                  <div className="four wide column">
                    <div className="row">
                      <div className="four wide column">
                        <MagicInput {...this.state.magicData}/>
                        <MagicSuggestions {...this.state.magicData}/>
                      </div>
                    </div>
                  </div>
                  <div className="twelve wide column">
                    <SubViews subviews={subviews}/>
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
