/**
 * Created by Derek on 3/26/15.
 */


/// <reference path="../typings/node/node.d.ts"/>

var spawn = require('child_process').spawn;

interface listenerFunc {
    (data:string) : any;
}

var parseCommand = function(c){
    var args = c.split(' ');
    var command = args.shift();
    return {
        command: command,
        args: args
    }
}

module.exports = function(){
    var api = <any> {};

    api.run = function(input:string){
        var successCB:listenerFunc;
        var errorCB:listenerFunc;
        var parsedCommand = parseCommand(input);
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


    return api;
}
