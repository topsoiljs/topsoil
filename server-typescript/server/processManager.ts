/// <reference path="./processAPIs/terminal.ts"/>
/// <reference path="./processAPIs/fs.ts"/>
/// <reference path="./processAPIs/git.ts"/>


var terminal = require('./processAPIs/terminal');
var fs = require('./processAPIs/fs');
var git = require('./processAPIs/git');
var repl = require('./processAPIs/repl');
var processes = require('./processAPIs/processes');

module.exports = function(){
    var api = <any> {};
    api.terminal = terminal;
    api.git = git;
    api.fs = fs;
    api.repl = repl
    api.processes = processes;
    return api;
};
