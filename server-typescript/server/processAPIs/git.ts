/// <reference path="../utility/utility.ts"/>
var fs = require('fs');
var utility = require('../utility/utility');
var createSpawnStreamF = require('../streaming/streaming').createSpawnStream;

var gitAPI = <any> {};

//wrapper function will take in a callback that process the outputs into workable JSON format
gitAPI.status = gitWrapper('git', parseStatus);

//gitAPI.add = gitWrapper('add', utility.identity);
//
//gitAPI.reset = gitWrapper('reset', utility.identity);
//
//gitAPI.diff = gitWrapper('diff', parseDiff);

module.exports = gitAPI;

function gitWrapper(command, parser) {
    console.log('created this function');
    return function(opts) {
        var spawnStream = createSpawnStreamF(opts.cmd, opts.args, opts.opts, parser);
        return spawnStream;
    };
}

//function gitWrapper(cmd:String,cb:Function){
//    return function(socket){
//        return function(opts){
//            if(!opts.dir){
//                socket.emit(opts.uid, utility.wrapperResponse({ errno: 99, code: 'CUSTOM', desc: 'No directory given' }, null));
//                return;
//            }
//            Array.prototype.unshift.call(opts.args,cmd);
//            utility.makeProcess(socket, 'git', opts, cb);
//        }
//    }
//}

function parseStatus(str:String){
    var emptyResult = {
        newfile: [],
        staged: [],
        unstaged: [],
        untracked: []
    };
    var result = utility.splitLines(str).reduce(function(result,element){
        console.log('element is ', element);
        var marker = element.substr(0,3);
        if(marker == '?? '){
            result.untracked.push(element.slice(3));
        }
        if(marker.charAt(0) === 'M') {
            result.staged.push(element.slice(3));
        }
        if(marker.charAt(0) === 'A') {
            result.staged.push(element.slice(3));
        }
        if(marker.charAt(1) === 'M') {
            result.unstaged.push(element.slice(3));
        }
        return result;
    }, emptyResult);

    return JSON.stringify(result);
}

function parseDiff(str:String){
    var result = {
        file: '',
        text: [],
    };
    result.text = utility.splitLines(str).slice(4).map(function(line){
        return _parseDiffLine(_parseDiffAt(line));
    }).filter(function(line){
        return line[0] !== undefined;
    });
    return result;
}

function _parseDiffAt(str:String){
    if(str[0]==='@'){
        var result= str.split('@@');
        return result[2];
    }
    return str;
};

function _parseDiffLine(str:String){
    return [str[0], str.slice(1)];
}