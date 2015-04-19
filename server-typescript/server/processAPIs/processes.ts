/// <reference path="../../typings/node/node.d.ts"/>
var createGenericStream = require('../streaming/streaming').createGenericStream;
var processesAPI = <any> {};
var es = require('event-stream');
var ps = require('ps-node');
processesAPI.killProcess = function(opts) {
  return createGenericStream(function(chunk, enc, cb){
    ps.kill(String(chunk), function(err){
      console.log('killed', String(chunk), 'err', err);
      cb(err);
    })
  });
};

module.exports = processesAPI;
