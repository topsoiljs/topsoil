/// <reference path="../utility/utility.ts"/>
var fs = require('fs');
var utility = require('../utility/utility');

var gitAPI = <any> {};

//wrapper function will take in a callback that process the outputs into workable JSON format
gitAPI.status = gitWrapper('status', parseStatus);

gitAPI.add = gitWrapper('add', utility.identity);

gitAPI.reset = gitWrapper('reset', utility.identity);
//gitAPI.log = gitWrapper('log', function(data){console.log(data); return data;});

module.exports = gitAPI;

function gitWrapper(cmd:String,cb:Function){
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

function parseStatus(str:String){
    var emptyResult = {
        newfile: [],
        staged: [],
        unstaged: [],
        untracked: []
    };

    return utility.splitLines(str).reduce(function(result,element){
        var marker = element.substr(0,3);
        console.log('the marker is ', marker);
        if(marker == '?? '){
            result.untracked.push(element.slice(3));
        }
        if(marker.charAt(0) === 'M') {
            result.staged.push(element.slice(3));
        }
        if(marker.charAt(0) === 'A') {
            result.newfile.push(element.slice(3));
        }
        if(marker.charAt(1) === 'M') {
            result.unstaged.push(element.slice(3));
        }
        return result;
    }, emptyResult);
}
