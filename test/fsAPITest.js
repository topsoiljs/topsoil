var fs = require('fs');
var io = require('socket.io-client');
var assert = require('chai').assert;
var currentDir = __dirname;


describe("Chat Server",function(){

  it('should connect to server', function(done){
    var client = io('http://localhost:8000/');
    client.on('connect', function(data){
      assert.typeOf(data, 'undefined', 'receive notice that it connected to server');
      client.disconnect();
      done();
    })
  });
});


describe("File System View APIs",function(){
  it('should be able to create a directory', function(done){
    var client = io('http://localhost:8000/',{'force new connection':true});
    var UID = Math.random();

    client.on('connect', function(data){
      client.emit('fs.mkdir',{
        dir: currentDir + '/randomTestFolder',
        uid: UID
      });
      client.on(UID, function(data){
        assert.typeOf(data, 'object', 'receive an object back');
        assert.isTrue(data.hasOwnProperty('err')&&data.hasOwnProperty('data'), 'object has "err" and "data" properties');
        assert.isTrue(fs.existsSync(currentDir + '/randomTestFolder'), 'created a test directory');
        client.disconnect();
        done();
      });
    })
  });

  it('should throw an error if path is invalid', function(done){
    var client = io('http://localhost:8000/',{'force new connection':true});
    var UID = Math.random();

    client.on('connect', function(data){
      client.emit('fs.mkdir',{
        dir: null,
        uid: UID
      });
      client.on(UID, function(data){
        assert.typeOf(data, 'object', 'receive an object back');
        assert.isTrue(data.hasOwnProperty('err')&&data.hasOwnProperty('data'), 'object has "err" and "data" properties');
        assert.equal(data.err.errno, 99, 'get custom error code');
        client.disconnect();
        done();
      });
    })
  });

  it('should be able to create a file', function(done){
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

  it('should be able to append to a file', function(done){
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


  it('should list all files in directory with ls', function(done){
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

  it('should be able to remove a file', function(done){
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

  it('should be able to remove an empty directory', function(done){
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

