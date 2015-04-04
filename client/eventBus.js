var EventBus = function() {
  var events = {};

  var api = {
    register: function(view, listener) {
      events[view] = events[view] || [];
      events[view].push(listener);
    },
    emit: function(view, data) {
      if(events[view]) {
        events[view].forEach(function(listener){
          listener(data);
        })
      }
    }
  }

  return api;
}

var eventBus = EventBus();
