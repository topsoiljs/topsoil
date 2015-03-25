/**
 * Created by Derek on 3/24/15.
 */
/// <reference path="typings/hapi/hapi.d.ts"/>
var Hapi = require("hapi");
//// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});
////direct to home page
/*server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        console.log(__dirname);
        reply.file(__dirname + '/client/index.html');
    }
});*/
////serve static assets
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'client'
        }
    }
});
server.start();
