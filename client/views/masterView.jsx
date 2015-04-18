var masterStore = require("../masterStore.js");
var MagicInput = require("../magic/magicInput.jsx");
var MagicSuggestions = require("../magic/MagicSuggestions.jsx");
var eventBus = require("../eventBus.js")

var MasterView = React.createClass({
  getInitialState: function() {
    return masterStore.getState();
  },
  componentDidMount: function() {
    eventBus.register("master", function() {
      this.setState(masterStore.getState());
    }.bind(this));
  },
  render: function() {
    console.log("state:", this.state);
    return (<div>
              <div className="row">
                <div className="magicInput col s4">
                  <MagicInput {...this.state.magicData}/>
                </div>
              </div>
              <div className="row">
                <div className="main col s2">
                  <MagicSuggestions {...this.state.magicData}/>
                </div>
                <div className="main col s10">
                  {this.state.activeView ? <this.state.activeView/> : <div/>}
                </div>
              </div>
            </div>);
  }
});


$(function(){
  React.render(<MasterView />, document.getElementById('app'));
})
