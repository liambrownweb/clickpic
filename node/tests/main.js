var server = require('../server');

exports.testMain = function (test) {
    test.equal(server.whoAreYou(), true);
    test.done();
};
