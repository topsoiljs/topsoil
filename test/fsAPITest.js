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
      socket.emit(opts._uid, data);
    }
  }
};


describe("Chat Server",function(){

  xit('should connect to server', function(done){
    var client = io('http://localhost:8000/');
    client.on('connect', function(data){
      assert.typeOf(data, 'undefined', 'receive notice that it connected to server');
      client.disconnect();
      done();
    })
  });
});


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

  xit('should be able to create a file', function(done){

    var client = io('http://localhost:8000/',{'force new connection':true});
    var UID = Math.random();
    var testFilePath = currentDir + '/randomTestFolder/test.js'
    client.on('connect', function(data){
      client.emit('fs.writeFile',{
        dir: testFilePath,
        data: 'console.log("this is a test");',
        uid: UID
      });
      client.on(UID, function(data){
        assert.typeOf(data, 'object', 'receive an object back');
        assert.isTrue(data.hasOwnProperty('err')&&data.hasOwnProperty('data'), 'object has "err" and "data" properties');
        assert.isTrue(fs.existsSync(testFilePath), 'created a test file');
        client.disconnect();
        done();
      });
    })
  });

  xit('should be able to append to a file', function(done){
    var client = io('http://localhost:8000/',{'force new connection':true});
    var UID = Math.random();
    var newUID = Math.random();
    var testFilePath = currentDir + '/randomTestFolder/test.js'
    client.on('connect', function(data){
      client.emit('fs.append',{
        dir: testFilePath,
        data: '2',
        uid: UID
      });
      client.on(UID, function(data){
        assert.isTrue(data.hasOwnProperty('err')&&data.hasOwnProperty('data'), 'object has "err" and "data" properties');
        assert.isTrue(fs.existsSync(testFilePath), 'created a test file');
        client.emit('fs.readFile', {
          dir: testFilePath,
          uid: newUID
        });
      });
      client.on(newUID, function(data){
        assert.equal('console.log("this is a test");2', data.data, 'get appended result');
        client.disconnect();
        done();
      })
    })
  });


  xit('should list all files in directory with ls', function(done){
    var client = io('http://localhost:8000/',{'force new connection':true});
    var UID = Math.random();
    var testFilePath = currentDir + '/randomTestFolder';
    client.on('connect', function(data){
      client.emit('fs.ls',{
        dir: testFilePath,
        uid: UID
      });
      client.on(UID, function(data){
        assert.typeOf(data, 'object', 'receive an object back');
        assert.isTrue(data.hasOwnProperty('err')&&data.hasOwnProperty('data'), 'object has "err" and "data" properties');
        assert.deepEqual(data.data, ['test.js'], 'list current directory files');
        client.disconnect();
        done();
      });
    })
  });

  xit('should be able to remove a file', function(done){
    var client = io('http://localhost:8000/',{'force new connection':true});
    var UID = Math.random();
    var testFilePath = currentDir + '/randomTestFolder/test.js'
    client.on('connect', function(data){
      client.emit('fs.unlink',{
        dir: testFilePath,
        data: 'console.log("this is a test")',
        uid: UID
      });
      client.on(UID, function(data){
        assert.typeOf(data, 'object', 'receive an object back');
        assert.isTrue(data.hasOwnProperty('err')&&data.hasOwnProperty('data'), 'object has "err" and "data" properties');
        assert.isFalse(fs.existsSync(testFilePath), 'created a test file');
        client.disconnect();
        done();
      });
    })
  });

  xit('should be able to remove an empty directory', function(done){
    var client = io('http://localhost:8000/',{'force new connection':true});
    var UID = Math.random();

    client.on('connect', function(data){
      client.emit('fs.rmdir',{
        dir: currentDir + '/randomTestFolder',
        uid: UID
      });
      client.on(UID, function(data){
        assert.typeOf(data, 'object', 'receive an object back');
        assert.isTrue(data.hasOwnProperty('err')&&data.hasOwnProperty('data'), 'object has "err" and "data" properties');
        assert.isFalse(fs.existsSync(currentDir + '/randomTestFolder'), 'created a test directory');
        client.disconnect();
        done();
      });
    })
  });
});

