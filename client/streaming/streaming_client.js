window._globalSocket = io();

var createNewStream = function(options){
  /*
    options should be of form
    {
      command: string : command you want to run,
      opts: object : options object that will be passed to api on backend,
      cb: function : callback (data) => void,
      initialData: string : OPTIONAL data that will be passed through input pipe if chaining.
      commands: array : OPTIONAL array of command objects for use with chaining command, SEE BELOW
    }

    cb will receive data of form
    {
      data: string : the payload
    }
  */

  /*
    For the 'chain' command,
    specify the commands you want to chain, in order, with an array of this form
    commands: [
      {
        name: 'fs.readFile',
        opts: {
          dir: '/Users/johntan/code/topsoil/client/magic/magicInput.jsx'
        }
      },
      {
        name: 'terminal.callCommand',
        opts: {
          cmd: 'grep',
          args: ['magic']
        }
      }
  */



  var command = options.command;
  var opts = options.opts;
  var cb = options.cb;
  opts.initialData = options.initialData;

  var UID = Math.random().toString(36) + Math.random().toString(36);
  opts._uid = UID;

  window._globalSocket.emit(command, opts);
  window._globalSocket.on(UID, cb);

  return {
    emit: function(data){
      window._globalSocket.emit(UID, data);
    }
  }
};
