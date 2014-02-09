var admin = require('../routes/admin');

var res = {
    my : {},
    render : function () {
        my.has_run = true;
    }
};

exports.testMainFunction = function (test) {
    admin.main(res, {});
    test.ok(res.has_run, "Res thinks testMainFunction hasn't called its render function.");
    test.done();
};
