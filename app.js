/**
 * Created by Derek on 3/24/15.
 */
/// <reference path="./typings/hapi/hapi.d.ts" />
var Hapi = require("hapi");
//// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        console.log(request);
        reply('hello world');
    }
});
server.start();
//# sourceMappingURL=app.js.map