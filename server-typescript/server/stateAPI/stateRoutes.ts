/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../utility/utility.ts"/>

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

    }
  },
  get: <Route>{
    method: 'GET',
    path: '/state/{session}/{key}',
    handler: function(request, reply){

    }
  }
};

module.exports = function(server){
  for(var key in routes){
    server.route(routes[key]);
  }
}
