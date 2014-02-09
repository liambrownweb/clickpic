var mongo = require('mongojs'),
    my = {
        collections: ["maps", "metadata"],
        validateData: function (collection, filters, callback) {
            if (typeof collection !== 'string') {
                throw Error("Invalid data for collection:" + collection);
            } else if (typeof filters !== 'object') {
                throw Error("Invalid value for filters: must be a BSON-compatible object");
            } else if (typeof callback !== 'function') {
                throw Error("Invalid value for callback: not a function");
            }
        },
    },
    functions = {
        id: "database",
        connect: function (host_data) {
            var host_name;
            if (typeof host_data === 'string') {
                host_name = host_data;
            }
            my.db = mongo.connect(host_name, my.connections);
            console.log("Connected to DB");
        },
        del: function (collection, filters, callback) {
            my.validateData(collection, filters, callback);
            my.db[collection].remove(filters, function(err, results) {
                if (err) {
                    throw Error("Remove query generated error:" + err);
                }
                callback (results);
            });
        },
        find: function (collection, filters, callback) {            
            my.validateData(collection, filters, callback);
            my.db[collection].find(filters, function(err, results) {
                if (err) {
                    throw Error("Find query generated error:" + err);
                }
                callback (results);
            });
        },
        insert: function (collection, filters, callback) {
            my.validateData(collection, filters, callback);
            my.db[collection].insert(filters, function(err, results) {
                if (err) {
                    throw Error("Insert query generated error:" + err);
                }
                callback (results);
            });
        },
        update: function (collection, filters, changes, callback) {
            my.validateData(collection, filters, callback);
            my.db[collection].update(filters, {$set: changes}, function(err, results) {
                if (err) {
                    throw Error("Update query generated error:" + err);
                }
                callback (results);
            });
        },
    };
var i;
for (i in functions) {
    if (functions.hasOwnProperty(i)) {
        exports[i] = functions[i];
    }
}
