

function MasterStore() {
  var activeView;
  
  var masterStore = {
    openView: function(newViewComponent) {
      activeView = newViewComponent;
    },
    closeView: function() {
      
    },
    getState: function() {
      return activeView;
    }
  }
}



