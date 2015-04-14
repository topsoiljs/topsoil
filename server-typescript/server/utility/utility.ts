/// <reference path="../../typings/node/node.d.ts"/>

var spawn = require('child_process').spawn;
var utility = <any> {};
var _ = require('lodash');


utility.wrapperResponse = function(err:string, data:string){
    if(!data) data = '';
    return {
        err: err,
        data: data
    };
};

utility.parseCommand = function(c){
    var args = c.split(' ');
    var command = args.shift();
    return {
        command: command,
        args: args
    };
};

utility.makeProcess = function(socket, cmd, opts, cb){
    var proc = spawn(cmd, opts.args, {cwd: opts.dir});
    var result = '';

    if(cb === undefined) {
      cb = function(data) {
        return data;
      }
    }

    try{
        proc.stdout.on('data', function(data){
            result+=String.fromCharCode.apply(null, new Uint16Array(data));
        });

        proc.stdout.on('end', function(){
            socket.emit(opts.uid, utility.wrapperResponse(null, cb(result)));
        });

        proc.stdout.on('error', function(e){
            socket.emit(opts.uid, utility.wrapperResponse(e, null));
        });
    } catch(err){
        console.log('caught an error in the try block', err);
    }
};

utility.splitLines = function(str){
  return str.split('\n');
};

utility.updateIn = function(obj, lookupProps, val) {
  //What if the prop I am looking up is a value? (add error throw?)
  //What if it is empty? (make a new obj)
  obj = _.cloneDeep(obj);
  var objectVals = [obj];
  
  lookupProps.forEach(function(lookupProp) {
    var obj = _.last(objectVals)[lookupProp];
  
    if(obj === undefined) {
      _.last(objectVals)[lookupProp] = {};
      obj = _.last(objectVals)[lookupProp];
    }
     
    objectVals.push(obj);
  });
  
  var lastLookupProp = _.last(lookupProps);
  objectVals[objectVals.length - 2][lastLookupProp] = val;
  
  return obj;
}

utility.interleave = function(arr1: Array<any>, arr2: Array<any>) {
  var index = 0;
  return arr1.reduce(function(accum, val) {
    accum.push(val);
    if(arr2[index] !== undefined) {
      accum.push(arr2[index]);
    }
    index += 1;
    return accum;
  }, []);
}

utility.identity = function(data){
    if(!data){
        console.log('no data passed');
        return '';
    }
    return data;
};

utility.logIdentity = function(data){
    if(!data){
        console.log('no data passed');
        return '';
    }
    console.log(data);
    return data;
};

module.exports = utility;