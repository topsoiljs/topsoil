/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../utility/utility.ts"/>
var fs = require('fs');
var utility = require('../utility/utility');

var fsAPI = <any> {};

fsAPI.ls = fsWrapper(fs.readdir, ['dir']);

fsAPI.readFile = fsWrapper(function(path, cb){
    fs.readFile(path, {encoding: 'utf8'}, cb)
}, ['dir']);

fsAPI.writeFile = fsWrapper(fs.writeFile, ['dir', 'data']);

fsAPI.unlink = fsWrapper(fs.unlink, ['dir']);

fsAPI.append = fsWrapper(fs.append, ['dir', 'data']);

fsAPI.mkdir = fsWrapper(fs.mkdir, ['dir']);

fsAPI.rmdir = fsWrapper(fs.rmdir, ['dir']);

module.exports = fsAPI;

function fsWrapper(fsCallback, args){
    return function(socket){
        return function(opts){
            //Set values for default directory and data if not provided, need to delete this later

            if(!opts.dir) opts.dir = '/';
            console.log('options are ', opts);


            var arguments = args.map(function(arg){
                return opts[arg];
            });

            //check to see if there are additional arguments passed in
            if(opts.options){
                arguments.push(opts.options);
            }

            //push in a callback function that emits data to server
            arguments.push(function(err, data){
                socket.emit(opts.uid, utility.wrapperResponse(err, data));
            });
            fsCallback.apply(null, arguments);
        }
    }
}
