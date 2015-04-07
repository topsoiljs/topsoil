/**
 * Created by Derek on 3/26/15.
 */

/// <reference path="./processAPIs/terminal.ts"/>
/// <reference path="./processAPIs/fs.ts"/>


var terminal = require('./processAPIs/terminal');
var fs = require('./processAPIs/fs');

module.exports = function(){
    var api = <any> {};
    api.terminal = terminal;
    api.fs = fs;
    return api;
};