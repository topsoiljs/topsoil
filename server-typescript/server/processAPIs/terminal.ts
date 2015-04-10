/// <reference path="../../typings/node/node.d.ts"/>
var spawn = require('child_process').spawn;
var createSpawnStreamF = require('../streaming/streaming').createSpawnStream;
var terminalAPI = <any> {};
var es = require('event-stream');
terminalAPI.callCommand = function(opts, infoHandler) {
  console.log("terminal opts", opts);
  var spawnStream = createSpawnStreamF(opts.cmd, opts.args, opts.opts, infoHandler);
  return spawnStream;
};

module.exports = terminalAPI;


