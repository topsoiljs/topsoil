var fs = require('fs');
var assert = require('chai').assert;
var io = require('socket.io-client');
var uuid = require('../deploy/client/bower_components/node-uuid/uuid.js')

var streams = {};
var currentDir = __dirname;
var _globalSocket = io('http://localhost:8001/');

var createNewStream = function(options){

  var socket = _globalSocket;
  var command = options.command;
  var opts = options.opts || {};
  var cb = options.cb;
  opts.initialData = options.initialData;

  opts._uid = uuid.v4();

  socket.emit(command, opts);
  socket.on(opts._uid, cb);

  return {
    emit: function(data){
      socket.emit(opts._uid, {
        payload: data
      });
    }
  }
};

describe("File System View APIs",function(){

  after(function(done){
    _globalSocket.disconnect();
    done();
  });

  it('should be able to make a directory', function(done){
    streams['fs.mkdir'] = createNewStream({
      command: 'fs.mkdir',
      cb: function(data){
        assert.typeOf(data, 'object', 'receive an object back');
        assert.isTrue(data.hasOwnProperty('data'), 'object has "data" properties');
        done();
      },
      opts: {},
      initialData: currentDir + '/randomTestFolder'
    })
  });

  it('should be able to list files and directories', function(done){
    streams['fs.ls'] = createNewStream({
      command: 'fs.ls',
      cb: function(data){
        assert.typeOf(data, 'object', 'receive an object back');
        assert.isTrue(data.hasOwnProperty('data'), 'object has "data" properties');
        var files = data.data.split('\n');
        assert.isTrue(files.indexOf('randomTestFolder')>=0, 'list the randomTestFolder that we just created');
        done();
      },
      opts: {},
      initialData: currentDir
    })
  });

  it('should be able to write to a file', function(done){
    streams['fs.writeFile'] = createNewStream({
      command: 'fs.writeFile',
      cb: function(data){
        assert.typeOf(data, 'object', 'information has been written');
        assert.isTrue(fs.existsSync(currentDir + '/randomTestFolder/test.js'), 'the new test file is created');
        done();
      },
      opts: {
        path: currentDir + '/randomTestFolder/test.js'
      }
    })
    streams['fs.writeFile'].emit('test data');
  });

  it('should be able to append to a file', function(done){
    streams['fs.appendFile'] = createNewStream({
      command: 'fs.appendFile',
      cb: function(data){
        assert.typeOf(data, 'object', 'information has been written');
        assert.isTrue(fs.existsSync(currentDir + '/randomTestFolder/test.js'), 'the new test file is created');
        done();
      },
      opts: {
        path: currentDir + '/randomTestFolder/test.js'
      }
    })
    streams['fs.appendFile'].emit('more test data');
  });

  it('should be able to read a file', function(done){
    streams['fs.readFile'] = createNewStream({
      command: 'fs.readFile',
      cb: function(data){
        var texts = data.data.split('\n');
        assert.isTrue(texts[0]==='test data');
        assert.isTrue(texts[1]==='more test data');
        assert.typeOf(data, 'object', 'information has been written');
        done();
      },
      opts: {
        path: currentDir + '/randomTestFolder/test.js'
      }
    })
  });

  it('should be able to remove a file', function(done){
    streams['fs.unlink'] = createNewStream({
      command: 'fs.unlink',
      cb: function(data){
        assert.isTrue(!fs.existsSync(currentDir + '/randomTestFolder/test.js'), 'test javascript file should be deleted');
        done();
      },
      opts: {},
      initialData: currentDir + '/randomTestFolder/test.js'
    })
  });

  it('should be able to remove an empty directory', function(done){
    streams['fs.rmdir'] = createNewStream({
      command: 'fs.rmdir',
      cb: function(data){
        assert.isTrue(!fs.existsSync(currentDir + '/randomTestFolder/'), 'test javascript file should be deleted');
        done();
      },
      opts: {},
      initialData: currentDir + '/randomTestFolder'
    })
  });

});

