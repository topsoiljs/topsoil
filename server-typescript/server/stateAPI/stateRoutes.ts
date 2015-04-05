/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../utility/utility.ts"/>
interface StateStore {
  get: (session: string, key: string) => string;
  put: (session: string, key: string, value: string) => void;
}

class State implements StateStore {
  private store;

  constructor() {
    this.store = {};
  }

  get(session: string, key: string) : string {
    if(this.store[session]){
      if(this.store[session][key]){
        return this.store[session][key];
      }
    };
    throw new Error('not found');
  }

  put(session: string, key: string, value: string) {
    this.store[session] = this.store[session] || {};
    this.store[session][key] = value;
  }
}

var state = new State();

interface Route {
  method: string;
  path: string;
}

interface StateAPI {
  put: Route;
  get: Route;
}

var routes : StateAPI = <StateAPI>{
  put: <Route>{
    method: 'POST',
    path: '/state/{session}/{key}',
    handler: function(request, reply){
      if(request.params.session && request.params.key){
        var data : string = typeof request.payload === 'object' ? JSON.stringify(request.payload) : request.payload;
        state.put(request.params.session, request.params.key, data);
        reply(201);
      }else{
        reply(new Error('need session and key'));
      }
    }
  },
  get: <Route>{
    method: 'GET',
    path: '/state/{session}/{key}',
    handler: function(request, reply){
      var data : string;
      try {
        if(request.params.key && request.params.session){
          data = state.get(request.params.session, request.params.key);
          reply(data);
        }else{
          throw new Error('need session and key');
        }
      }catch(e){
        reply(404);
      }
    }
  }
};

module.exports = function(server){
  for(var key in routes){
    server.route(routes[key]);
  }
}
