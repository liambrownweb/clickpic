var my = {
        database: null,
        printClient: function (text) {
            res.send(text);
        },
    },
    res;

exports.connect = function (database_name) {
    my.database = require('../model/database');
    my.database.connect(database_name);
}

exports.main = function (req, res) {
    my.res = res;
    var project = req.params.project,
        filters = {"project": project},
        collection = "projects";
    my.database.find(collection, filters, my.printClient);
};

exports.manage = function (req, res) {
    var project = req.params.project;
    var action = req.params.action;
    var data = req.params.data | null;
};
