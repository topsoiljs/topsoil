/// <reference path="../../typings/node/node.d.ts"/>
var repl = require('repl');
var streaming = require('../streaming/streaming');
var createGenericStreamFunc = streaming.createGenericStream;
var createSpawnStreamFunc = streaming.createSpawnStream;
var createOutSocket = streaming.createOutStream;
var createInSocket = streaming.createInStream;
var createDuplexStream = streaming.createDuplexStream
var replAPI = <any> {};

replAPI.start = function(options){
  var inStream = createGenericStreamFunc(function(chunk, enc, cb){
    cb(null, String(chunk));
  })
  var outStream = createGenericStreamFunc(function(chunk, enc, cb){
    cb(null, chunk);
  })
  options.input = inStream;
  options.output = outStream;
  repl.start(options);
  return createDuplexStream(inStream, outStream);
}

module.exports = replAPI;
