/// <reference path="../../typings/node/node.d.ts"/>

var spawn = require('child_process').spawn;
var utility = <any> {};

utility.wrapperResponse = function(err:string, data:string){
    if(!data) data = '';
    return {
        err: err,
        data: data
    };
};

utility.parseCommand = function(c){
    var args = c.split(' ');
    var command = args.shift();
    return {
        command: command,
        args: args
    };
};

utility.makeProcess = function(socket, cmd, opts, cb){
    var proc = spawn(cmd, opts.args, {cwd: opts.dir});
    var result = '';

    try{
        proc.stdout.on('data', function(data){
            result+=String.fromCharCode.apply(null, new Uint16Array(data));
        });

        proc.stdout.on('end', function(){
            socket.emit(opts.uid, utility.wrapperResponse(null, cb(result)));
        });

        proc.stdout.on('error', function(e){
            socket.emit(opts.uid, utility.wrapperResponse(e, null));
        });
    } catch(err){
        console.log('caught an error in the try block', err);
    }
};

utility.splitLines = function(str){
  return str.split('\n');
};

module.exports = utility;