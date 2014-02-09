var server = require('../server');

exports.testMain = function (test) {
    test.equal(server.whoAreYou(), true);
    test.done();
};
/*
exports.testStartListening = function (test) {
    server.startListening();
    var server_status = server.getConnectionStatus();
    test.ok(server_status.port > 0, "Server should know it's connected; port is showing as "+server_status.port);
};*/

exports.testStopListening = function (test) {
    server.stopListening();
    var server_status = server.getConnectionStatus();
    test.equal(server_status.port, null, "Server should know it's connected; port is showing as "+server_status.port);
    test.done();
};
