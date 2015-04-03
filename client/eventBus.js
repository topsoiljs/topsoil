var EventBus = function() {

  var events = {};

  var api = {
    register: function(view, listener) {
      events[view] = listener;
    },
    emit: function(view) {
      if(events[view]) {
        events[view]();
      }
    }
  }

  return api;
}

var eventBus = EventBus();
