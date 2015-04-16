var fs = require('fs');
var io = require('socket.io-client');
var assert = require('chai').assert;
var uuid = require('../deploy/client/bower_components/node-uuid/uuid.js')

var streams = {};
var currentDir = __dirname;
var _globalSocket = io('http://localhost:8001/',{'force new connection':true});

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

describe("Git View APIs",function(){

  after(function(done){
    _globalSocket.disconnect();
    done();
  });

  it('should be able to call git status', function(done){

    streams['git.status'] = createNewStream({
      command: 'git.status',
      opts: {
        cwd: currentDir,
        cmd: 'git',
        args: ['status', '-s'],
      },
      cb: function(data){
        console.log(data);
        assert.typeOf(data, 'object', 'receive an object back');
        done();
      }
      // initialData: currentDir
    });

    streams['git.status'].emit('');
  });

  xit('should be able to create a file, see xit in untracked and stage xit', function(done){
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

  xit('should be able modify a file and see the difference', function(done){
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

  xit('should see a path under new files', function(done){
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

  xit('should be able to reset staged files', function(done){
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

  xit('should be able to see the file is now in untracked again', function(done){
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