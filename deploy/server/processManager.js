/**
 * Created by Derek on 3/26/15.
 */
/// <reference path="../../typings/node/node.d.ts"/>
var spawn = require('child_process').spawn;
var parseCommand = function (c) {
    var args = c.split(' ');
    var command = args.shift();
    return {
        command: command,
        args: args
    };
};
module.exports = function () {
    var api = {};
    api.run = function (input) {
        var successCB;
        var errorCB;
        var parsedCommand = parseCommand(input);
        var cmd = parsedCommand.command;
        var args = parsedCommand.args;
        var proc = spawn(cmd, args);
        try {
            (function start(cmd, args) {
                proc.stdout.on('data', function (data) {
                    successCB && successCB(data + '');
                });
                proc.stdout.on('error', function (e) {
                    errorCB && errorCB(e + '');
                });
            }(cmd, args));
        }
        catch (err) {
            console.log(err);
        }
        return {
            success: function (listener) {
                successCB = listener;
                return this;
            },
            error: function (listener) {
                errorCB = listener;
                return this;
            }
        };
    };
    return api;
};
>>>>>>> add a simple process manager
