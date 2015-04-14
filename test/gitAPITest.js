var fs = require('fs');
var io = require('socket.io-client');
var assert = require('chai').assert;
var currentDir = __dirname;

describe("Git View APIs",function(){
  it('should be able to call git status', function(done){
    var client = io('http://localhost:8000/',{'force new connection':true});
    var UID = Math.random();

    client.on('connect', function(data){
      client.emit('git.status', {
        args: ['-s'],
        dir: currentDir,
        uid: UID
      });
      client.on(UID, function(data){
        assert.typeOf(data, 'object', 'receive an object back');
        assert.isTrue(data.hasOwnProperty('err')&&data.hasOwnProperty('data'), 'object has "err" and "data" properties');
        assert.isTrue(data.data.hasOwnProperty('newfile'));
        assert.isTrue(data.data.hasOwnProperty('staged'));
        assert.isTrue(data.data.hasOwnProperty('unstaged'));
        assert.isTrue(data.data.hasOwnProperty('untracked'));
        client.disconnect();
        done();
      });
    })
  });

  it('should be able to create a file, see it in untracked and stage it', function(done){
    var client = io('http://localhost:8000/',{'force new connection':true});
    var UID = Math.random();
    var UID2 = Math.random();
    var testFilePath = currentDir + '/randomTestFolder/test.js'

    fs.mkdirSync(currentDir+'/randomTestFolder');
    fs.writeFileSync(testFilePath, 'this is data');

    client.on('connect', function(data){
      client.emit('git.status', {
        args: ['-s'],
        dir: currentDir,
        uid: UID
      });

      client.on(UID, function(data){
        assert.typeOf(data, 'object', 'receive an object back');
        assert.isTrue(data.data.untracked.indexOf('randomTestFolder/')>=0, 'untracked folder shows up in untracked');
        client.emit('git.add', {
          args: ['randomTestFolder/'],
          dir: currentDir,
          uid: UID2
        });
      });
      
      client.on(UID2, function(){
        client.disconnect();
        done();
      });

    })
  });

  it('should be able modify a file and see the difference', function(done){
    var client = io('http://localhost:8000/',{'force new connection':true});
    var UID = Math.random();
    var testFilePath = currentDir + '/randomTestFolder/test.js'

    fs.appendFileSync(testFilePath, 'more data');

    client.on('connect', function(data){
      client.emit('git.diff', {
        args: ['--no-prefix'],
        dir: currentDir,
        uid: UID
      });

      client.on(UID, function(data){
        assert.typeOf(data, 'object', 'receive an object back');
        // assert.isTrue(data.data.unstaged.indexOf('randomTestFolder/')>=0, 'untracked folder shows up in untracked');
        client.disconnect();
        done();
      });
    })
  });

  it('should see a path under new files', function(done){
    var client = io('http://localhost:8000/',{'force new connection':true});
    var UID = Math.random();

    client.on('connect', function(data){
      client.emit('git.status', {
        args: ['-s'],
        dir: currentDir,
        uid: UID
      });

      client.on(UID, function(data){
        assert.typeOf(data, 'object', 'receive an object back');
        assert.isTrue(data.data.newfile.indexOf('randomTestFolder/test.js')>=0, 'untracked folder shows up in untracked')
        client.disconnect();
        done();

      });
    })
  });

  it('should be able to reset staged files', function(done){
    var client = io('http://localhost:8000/',{'force new connection':true});
    var UID = Math.random();

    client.on('connect', function(data){
      client.emit('git.reset', {
        args: ['HEAD', 'randomTestFolder/test.js'],
        dir: currentDir,
        uid: UID
      });

      client.on(UID, function(data){
        assert.typeOf(data, 'object', 'receive an object back');
        client.disconnect();
        done();

      });
    })
  });

  it('should be able to see the file is now in untracked again', function(done){
    var client = io('http://localhost:8000/',{'force new connection':true});
    var UID = Math.random();

    client.on('connect', function(data){
      client.emit('git.status', {
        args: ['-s'],
        dir: currentDir,
        uid: UID
      });

      client.on(UID, function(data){
        assert.typeOf(data, 'object', 'receive an object back');
        assert.isTrue(data.data.untracked.indexOf('randomTestFolder/')>=0, 'untracked folder shows up in untracked');
        fs.unlinkSync(currentDir+'/randomTestFolder/test.js');
        fs.rmdirSync(currentDir+'/randomTestFolder');
        client.disconnect();
        done();
      });
    })
  });

})