/// <reference path="../utility/utility.ts"/>
var fs = require('fs');
var utility = require('../utility/utility');
var createSpawnEndStreamF = require('../streaming/streaming').createSpawnEndStream;
var execSync = require('child_process').execSync;
var gitAPI = <any> {};


//wrapper function will take in a callback that process the outputs into workable JSON format
gitAPI.status = gitWrapper(['status', '-s'], parseStatus);

gitAPI.commitAdd = gitWrapper(['commit', '-am'], utility.identity);

gitAPI.push = gitWrapper(['push'], utility.identity);

gitAPI.add = gitWrapper(['add'], utility.identity);

gitAPI.reset = gitWrapper(['reset', 'HEAD'], utility.identity);

gitAPI.diff = gitWrapper(['diff', '--no-prefix'], parseDiff);

module.exports = gitAPI;

function gitWrapper(args, parser) {
  return function(opts) {
    var spawnStream = createSpawnEndStreamF('git', args, opts.opts, parser, opts.args);
    return spawnStream;
  };
};

function parseCommitAdd(str:String){
    return str;
};

function parseStatus(str:String, options){
    var emptyResult = {
        newfile: [],
        staged: [],
        unstaged: [],
        untracked: [],
        branch: ""
    };
    var result = utility.splitLines(str).reduce(function(result,element){

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
    var branches = String(execSync('git branch', options)).split('\n');
    result.branches = branches;
    branches.forEach(function(el){
        if(el.indexOf('*') > -1){
            result.branch = el.slice(2);
        }
    });
    return JSON.stringify(result);
};

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
    return JSON.stringify(result);
};

function _parseDiffAt(str:String){
    if(str[0]==='@'){
        var result= str.split('@@');
        return result[2];
    }
    return str;
};

function _parseDiffLine(str:String){
    return [str[0], str.slice(1)];
};
