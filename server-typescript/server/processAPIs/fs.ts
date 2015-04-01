/// <reference path="../../../typings/node/node.d.ts"/>
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
            var emit = function(err, data){
                socket.emit(opts.uid, utility.wrapResponse(err, data));
            };
            var arguments = args.map(function(arg){
                return opts[arg];
            });
            arguments.push(emit);
            fsCallback.apply(null, arguments);
        }
    }
}