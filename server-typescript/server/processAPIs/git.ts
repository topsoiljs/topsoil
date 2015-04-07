/// <reference path="../utility/utility.ts"/>
var fs = require('fs');
var utility = require('../utility/utility');

var gitAPI = <any> {};

//wrapper function will take in a callback that process the outputs into workable JSON format
gitAPI.status = gitWrapper('status', function(data){console.log(data); return data});

gitAPI.history = gitWrapper('history', function(data){console.log(data); return data;});

module.exports = gitAPI;

function gitWrapper(cmd,cb){
    return function(socket){
        return function(opts){
            if(!opts.dir){
                socket.emit(opts.uid, utility.wrapperResponse({ errno: 99, code: 'CUSTOM', desc: 'No directory given' }, null));
                return;
            }
            Array.prototype.unshift.call(opts.args,cmd);
            utility.makeProcess(socket, 'git', opts, cb);
        }
    }
}