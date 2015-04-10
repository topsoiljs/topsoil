/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../utility/utility.ts"/>
/// <reference path="terminal.ts"/>
var fs = require('fs');
var _ = require('lodash');
var utility = require('../utility/utility');
var streaming = require('../streaming/streaming');
var createGenericStreamFunc = streaming.createGenericStream;
var createSpawnStreamFunc = streaming.createSpawnStream;
var createDuplexStream = streaming.createDuplexStream;
var exec = require('child_process').exec;

var fsAPI = <any> {};

fsAPI.ls = function(opts){
  var listStream = createGenericStreamFunc(function(data : string, enc : string, cb){
    exec('ls ' + data, function(err, out, stderr){
      cb(null, out);
    })
  });
  return listStream;
};

fsAPI.readFile = fsStreamWrapper(fs.createReadStream, ['path'], 0);

fsAPI.writeFile = fsStreamWrapper(fs.createWriteStream, ['path'], 1);

fsAPI.unlink = fsSingleWrapper(fs.unlink);

fsAPI.appendFile = fsStreamWrapper(fs.createWriteStream, ['path'], 1, {
  flags: 'a'
});

fsAPI.mkdir = fsSingleWrapper(fs.mkdir);

fsAPI.rmdir = fsSingleWrapper(fs.rmdir);

fsAPI.listAllFilesAndDirs = function(opts){
  var listStream = createGenericStreamFunc(function(data : string, enc : string, cb){
    exec('ls -R ' + data, {cwd: opts.cwd},function(err, out, stderr){
      cb(null, out);
    })
  });
  var streamOut = listStream.pipe(fsSingleWrapper(listAllFilesAndDirs)());
  return createDuplexStream(listStream, streamOut);
};

function listAllFilesAndDirs (data, cb){

  function cleanFolder(folder: Array<string>) {
    if(_.first(folder) === ".") {
      folder = folder.slice(1);
    }

    //refactor this into a chain.
    if(_.endsWith(_.last(folder)), ":") {
      folder[folder.length - 1] = _.trimRight(_.last(folder), ":");
    }

    return folder;
  }

  function filterDirs(arr) {
    return arr.filter(function(file) { return file.indexOf(".") > -1});
  }
  var dirs = data.split("\n\n");
  /*
     The data comes in the format:

     ./dir_path
       file
       folder
       file
       
     ./dir_path2
       file
       ..
       ...
  */

  var pwdFiles = dirs[0].split("\n");
  dirs.shift(); //Get rid of pwd.

  var result = {files: filterDirs(pwdFiles), folders: {}};

  cb(null, dirs.reduce(function(result, dir) {
    var foldersAndFiles = dir.split("\n");
    var folder = cleanFolder(foldersAndFiles[0].split("/"));
    var files = filterDirs(foldersAndFiles.slice(1));
    var folderArr = _.range(0, folder.length).map(function() { return "folders" });

    return utility.updateIn(result, utility.interleave(folderArr, folder), {files: files, folders: {}});
  }, result));
}

fsAPI.unlink = fsWrapper(fs.unlink, ['dir']);

fsAPI.append = fsWrapper(fs.append, ['dir', 'data']);

fsAPI.mkdir = fsWrapper(fs.mkdir, ['dir']);

fsAPI.rmdir = fsWrapper(fs.rmdir, ['dir']);

module.exports = fsAPI;

function fsStreamWrapper(createStream, args, mode: number, options?) {
    // Mode 0=read, 1=write, 2=duplex
    // Options will be default options passed in as last argument
    return function(opts) {
        if (!opts.dir) opts.dir = '/';

        var arguments = args.map(function(arg) {
            return opts[arg];
        });
        //check to see if there are additional arguments passed in
        if (opts.options) {
            arguments.push(opts.options);
        } else {
            arguments.push(options);
        }
        var stream = createStream.apply(null, arguments);
        var returnStream;
        if (mode === 1) {
            returnStream = createGenericStreamFunc(function(chunk: string, enc: string, cb) {
                stream.write(chunk + '\n');
                cb(null, chunk);
            })
        } else {
            returnStream = stream;
        }
    }
}

function fsSingleWrapper(fsCallback){
  return function(){
    return createGenericStreamFunc(function(chunk, enc : string, cb){
        fsCallback(chunk.toString('utf8'), function(err, data){
          if(typeof data === 'object'){
            data = JSON.stringify(data);
          }else if(typeof data !== 'string'){
            data = String(data);
          }
          console.log(err);
          cb(err, data + '\n');
        })
    })
  }
};
