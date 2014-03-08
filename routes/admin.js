exports.main = function (req, res) {
    res.render('admin/main', { title: global.ui_strings.admin_name });
};
