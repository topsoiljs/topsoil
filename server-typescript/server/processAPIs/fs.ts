/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../utility/utility.ts"/>
/// <reference path="terminal.ts"/>
var fs = require('fs');
var _ = require('lodash');
var utility = require('../utility/utility');
var createGenericStreamFunc = require('../streaming/streaming').createGenericStream;
var fsAPI = <any> {};

fsAPI.ls = fsWrapper(fs.readdir, ['dir']);

fsAPI.readFile = fsWrapper(function(path, cb){
    fs.readFile(path, {encoding: 'utf8'}, cb)
}, ['dir']);

fsAPI.writeFile = fsWrapper(fs.writeFile, ['dir', 'data']);

fsAPI.unlink = fsWrapper(fs.unlink, ['dir']);

fsAPI.append = fsWrapper(fs.appendFile, ['dir', 'data']);

fsAPI.mkdir = fsWrapper(fs.mkdir, ['dir']);

fsAPI.rmdir = fsWrapper(fs.rmdir, ['dir']);

fsAPI.listAllFilesAndDirs = function(socket) {
  return function(opts) {
    opts.args = ["-R"];

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

    utility.makeProcess(socket, "ls", opts, function(data) {
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

      var result = {pwd: opts.dir, files: filterDirs(pwdFiles), folders: {}};

      return dirs.reduce(function(result, dir) {
        var foldersAndFiles = dir.split("\n");
        var folder = cleanFolder(foldersAndFiles[0].split("/"));
        var files = filterDirs(foldersAndFiles.slice(1));
        var folderArr = _.range(0, folder.length).map(function() { return "folders" });

        return utility.updateIn(result, utility.interleave(folderArr, folder), {files: files, folders: {}, pwd: opts.dir + "/" + folder.join("/")});
      }, result);
    })
  }
}

module.exports = fsAPI;

function fsSingleWrapper(fsCallback){
  return createGenericStreamFunc(function(chunk : string, enc : string, cb){
    fsCallback(chunk, function(err, data){
      cb(err, data);
    })
  })
}


function fsWrapper(fsCallback, args){
    return function(socket){
        return function(opts){
            //Set values for default directory and data if not provided, need to delete this later

            if(!opts.dir) opts.dir = '/';

            var arguments = args.map(function(arg){
                return opts[arg];
            });

            //check to see if there are additional arguments passed in
            if(opts.options){
                arguments.push(opts.options);
            }

            //push in a callback function that emits data to server
            arguments.push(function(err, data){
                socket.emit(opts.uid, utility.wrapperResponse(err, data));
            });

            fsCallback.apply(null, arguments);
        }
    }
}
