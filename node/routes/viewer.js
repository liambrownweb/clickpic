exports.main = function (req, res) {
    var viewer_title = 'Clickpic Viewer v0.0';
    res.render('viewer', { title: viewer_title });
};
