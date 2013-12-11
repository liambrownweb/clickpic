/*
 * GETs something from the images directory.
 */

exports.main = function (req, res) {
    if (req.query.hasOwnProperty("file")) {
        console.log("attempting to load file...");
        res.sendfile("/srv/www/htdocs/clickpic/data/images/"+req.query.file);
    }
};
