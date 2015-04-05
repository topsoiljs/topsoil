/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../utility/utility.ts"/>



interface PutOpts {
  key: string;
  value: <any>;
}

interface PutAPI {
  (opts: PutOpts) : void;
}

interface GetOpts {
  key: string;
}

interface GetAPI {
  (opts: GetOpts) : void;
}

interface StateAPI {
  put: (socket: <any>) : PutAPI;
  get: (socket: <any>) : GetAPI;
}

var api = <StateAPI>{};

api.put = function(socket){
  return function(opts){

  }
}

api.get = function(socket){
  return function(opts){

  }
}

