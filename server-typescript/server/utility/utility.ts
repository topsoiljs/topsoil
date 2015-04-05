/// <reference path="../../typings/node/node.d.ts"/>

var utility = <any> {};

utility.wrapperResponse = function(err:string, data:string){
    return {
        err: err,
        data: data
    };
};

utility.parseCommand = function(c){
    var args = c.split(' ');
    var command = args.shift();
    return {
        command: command,
        args: args
    };
};

module.exports = utility;