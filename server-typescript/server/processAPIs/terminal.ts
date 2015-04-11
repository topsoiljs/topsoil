/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../utility/utility.ts"/>
var spawn = require('child_process').spawn;
var utility = require('../utility/utility');

interface listenerFunc {
    (data:string) : any;
}

var terminalAPI = <any> {};

terminalAPI.run = function(socket) {
  return function(opts){   
     utility.makeProcess(socket, opts.cmd, opts)
  };  
}
module.exports = terminalAPI;