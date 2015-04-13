/// <reference path="../../typings/node/node.d.ts"/>
var spawn = require('child_process').spawn;
var createSpawnStreamF = require('../streaming/streaming');
var terminalAPI = <any> {};

terminalAPI.run = function(opts) {
  return createSpawnStreamF(opts.cmd, opts.args, opts.opts);
};

module.exports = terminalAPI;
