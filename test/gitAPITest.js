var fs = require('fs');
var path = require('path');
var io = require('socket.io-client');
var assert = require('chai').assert;
var uuid = require('../deploy/client/bower_components/node-uuid/uuid.js')

var streams = {};
var currentDir = __dirname;
var root = path.resolve(__dirname, '..');
console.log('root is ', root);
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
        opts: {cwd: root},
        args: ['status', '-s'],
      },
      cb: function(data){
        console.log(data);
        assert.typeOf(data, 'object', 'receive an object back');
        done();
      }
    });

    streams['git.status'].emit('test');
  });

  it('should be able to create a file, see it in untracked and stage it', function(done){
    var testFilePath = currentDir + '/randomTestFolder/test.js'
    fs.mkdirSync(currentDir+'/randomTestFolder');
    fs.writeFileSync(testFilePath, 'this is data');

    streams['git.add'] = createNewStream({
      command: 'git.add',
      opts: {
        args: ['add', 'test/randomTestFolder/'],
        opts: {cwd: root}
      },
      cb: function(data){
        done();
      }
    });

    streams['git.status'] = createNewStream({
      command: 'git.status',
      opts: {
        opts: {cwd: root},
        args: ['status', '-s'],
      },
      cb: function(data){
        streams['git.add'].emit('get');
        assert.typeOf(data, 'object', 'receive an object back');
        assert.isTrue(JSON.parse(data.data).untracked.indexOf('test/randomTestFolder/')>=0, 'untracked folder shows up in untracked');
      }
    });

    streams['git.status'].emit('puppy');

  });

  it('should be able modify a file and see the difference', function(done){
    var testFilePath = currentDir + '/randomTestFolder/test.js'

    fs.appendFileSync(testFilePath, 'more data');

    streams['git.diff'] = createNewStream({
      command: 'git.diff',
      opts: {
        opts: {cwd: root},
        args: ['diff', '--no-prefix', currentDir + '/randomTestFolder/test.js'],
      },
      cb: function(data){
        var res = JSON.parse(data.data)
        assert.typeOf(data, 'object', 'receive an object back');
        assert.isTrue(res.hasOwnProperty('file'), 'response has file name property');
        done();
      }
    });

    streams['git.diff'].emit('cat');
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