/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../utility/utility.ts"/>
var fs = require('fs');
var utility = require('../utility/utility');

var fsAPI = <any> {};

fsAPI.ls = fsWrapper(fs.readdir, ['dir']);

fsAPI.readFile = fsWrapper(fs.readFile, ['dir']);

fsAPI.writeFile = fsWrapper(fs.writeFile, ['dir', 'data']);

module.exports = fsAPI;

function fsWrapper(fsCallback, args){
    return function(socket){
        return function(opts){
            console.log('received args', args);

            //Set values for default directory and data if noy provided, need to delete this later

            if(!opts.dir) opts.dir = '/Users/Derek/Desktop/topsoil';
            console.log('options are ', opts);

            var emit = function(err, data){
                console.log('emit to', opts.uid);
                console.log('response object', utility.wrapperResponse(err, data));
                socket.emit(opts.uid, utility.wrapperResponse(err, data));
            };
            var arguments = args.map(function(arg){
                return opts[arg];
            });
            arguments.push(emit);
            console.log(fsCallback);
            fsCallback.apply(null, arguments);
        }
    }
}