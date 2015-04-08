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

     console.log(opts);
     var proc = spawn(opts.cmd, opts.args, {cwd: opts.dir});
  
     try{
        proc.stdout.on('data', function(data){
          function ab2str(buf) {
            return String.fromCharCode.apply(null, new Uint16Array(buf));
          }

          socket.emit(opts.uid, utility.wrapperResponse(false, ab2str(data)));
        });

        proc.stdout.on('error', function(e){
          console.log(e);
        });
     } catch(err){
        console.log(err);
     }
  };  
}
module.exports = terminalAPI;