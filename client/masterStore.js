

function MasterStore() {
  var activeView;
  
  var masterStore = {
    openView: function(newViewComponent) {
      activeView = newViewComponent;
      eventBus.emit("master");
    },
    closeView: function() {
      
    },
    getState: function() {
      return activeView;
    }
  }

  return masterStore; 
}

var masterStore = MasterStore();



