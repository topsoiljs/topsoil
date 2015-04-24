var fs = require('./fs');
var git = require('./git');
var processes = require('./processes');
var repl = require('./repl');
var terminal = require('./terminal');

var api = <any>{};

api.fs = fs;
api.git = git;
api.processes = processes;
api.repl = repl;
api.terminal = terminal;

module.exports = api;
