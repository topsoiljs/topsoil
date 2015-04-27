/// <reference path="../../typings/node/node.d.ts"/>
var createGenericStreamF = require('../streaming/streaming').createGenericStream;
var es = require('event-stream');
var ps = require('ps-node');
var log = global.log;
var processesAPI = <any> {};
processesAPI.killProcess = function(opts) {
  return createGenericStreamF(function(chunk, enc, cb){
    ps.kill(String(chunk), function(err){
      log.info('killed', String(chunk), 'err', err);
      cb(err);
    })
  });
};

module.exports = processesAPI;
