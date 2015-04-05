/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../utility/utility.ts"/>
interface StateStore {
  get: (session: string, key: string) => string;
  put: (session: string, key: string, value: string) => void;
}

class State implements StateStore {
  private store;

  constructor( parameters) {
    this.store = {};
  }

  get(session: string, key: string) : string {
    if(this.store.session){
      if(this.store.session[key]){
        return this.store.session[key];
      }
    };
    throw new Error('not found');
  }

  put(session: string, key: string, value: string) {
    this.store.session = this.store.session || value;
  }
}

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
    method: 'PUT',
    path: '/state/{session}/{key}',
    handler: function(request, reply){
      reply(request.params);
    }
  },
  get: <Route>{
    method: 'GET',
    path: '/state/{session}/{key}',
    handler: function(request, reply){
      reply(request.params);
    }
  }
};

module.exports = function(server){
  for(var key in routes){
    server.route(routes[key]);
  }
}
