var database = require('./database'),
    dbPrimitive = {
        load: function (collection, criteria) {
            
        }
    },
    functions = {
        image: function (id) {
            
        },
        room: function (id) {

        },
        house: function (id) {

        },
        account: function (id) {
        },
        loadObject: function (type, id) {
            if (functions.hasOwnProperty(type)) {
                var return_object = functions[type](id);
            }
        }
    };
database.connect('localhost');
var i;
for (i in functions) {
    if (functions.hasOwnProperty(i)) {
        exports[i] = functions[i];
    }
}