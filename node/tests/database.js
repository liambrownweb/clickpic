var database = require('../model/database');

exports.testDatabase = function (test) {
    test.equal(database.id, "database");
    test.done();
}
