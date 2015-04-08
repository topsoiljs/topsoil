/**
 * Created by Derek on 3/26/15.
 */

/// <reference path="./processAPIs/terminal.ts"/>
/// <reference path="./processAPIs/fs.ts"/>
/// <reference path="./processAPIs/git.ts"/>


var terminal = require('./processAPIs/terminal');
var fs = require('./processAPIs/fs');
var git = require('./processAPIs/git');

module.exports = function(){
    var api = <any> {};
    api.terminal = terminal;
    api.git = git;
    api.fs = fs;
    return api;
};