/**
 * Created by Derek on 3/26/15.
 */

<<<<<<< HEAD

/// <reference path="../typings/node/node.d.ts"/>

var spawn = require('child_process').spawn;
=======
/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="./processAPIs/terminal.ts"/>
/// <reference path="./processAPIs/fs.ts"/>
>>>>>>> add fs api to process manager

var terminal = require('./processAPIs/terminal');
var fs = require('.processAPIs/fs');

module.exports = function(){
    var api = <any> {};
    api.terminal = terminal;
    api.fs = fs;
    return api;
<<<<<<< HEAD
}
=======
};
>>>>>>> add fs api to process manager
