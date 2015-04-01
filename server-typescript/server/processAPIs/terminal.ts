/// <reference path="../../../typings/node/node.d.ts"/>
/// <reference path="../utility/utility.ts"/>
var spawn = require('child_process').spawn;
var utility = require('../utility/utility');

interface listenerFunc {
    (data:string) : any;
}

var terminalAPI = <any> {};

terminalAPI.run = function(input:string){
    var successCB:listenerFunc;
    var errorCB:listenerFunc;
    var parsedCommand = utility.parseCommand(input);
    var cmd = parsedCommand.command;
    var args = parsedCommand.args;
    var proc = spawn(cmd, args);

    try{
        (function start(cmd, args){
            proc.stdout.on('data', function(data){
                successCB && successCB(data+'');
            });
            proc.stdout.on('error', function(e){
                errorCB && errorCB(e+'');
            });
        }(cmd, args))
    } catch(err){
        console.log(err);
    }

    return {
        success: function(listener:listenerFunc){
            successCB = listener;
            return this;
        },
        error: function(listener:listenerFunc){
            errorCB = listener;
            return this;
        }
    }
};

module.exports = terminalAPI;