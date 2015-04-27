/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../utility/utility.ts"/>
var level = require('level');
interface StateStore {
  get: (session: string, key: string, cb: any) => void;
  put: (session: string, key: string, value: string, cb: any) => void;
}

class State implements StateStore {
  private store;

  constructor() {
    this.store = level(__dirname + '/db');
  }

  get(session: string, key: string, cb) {
    this.store.get(session + key, cb);
  }

  put(session: string, key: string, value: string, cb) {
    this.store.put(session + key, value, cb);
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
        var payload = request.payload.data;
        var data : string = typeof payload === 'object' ? JSON.stringify(payload) : payload;
        state.put(request.params.session, request.params.key, data, function(){
          reply(201);
        });
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
      if(request.params.key && request.params.session){
        state.get(request.params.session, request.params.key, function(err, data){
          if(err){
            log.error('error', err);
            reply(404);
          }else{
            reply(data);
          }
        });
      }else{
        log.error('need session and key');
        throw new Error('need session and key');
      }
    }
  }
};

module.exports = function(server){
  for(var key in routes){
    server.route(routes[key]);
  }
}
