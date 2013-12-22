/*
 * GETs something from the images directory.
 */

exports.main = function (req, res) {
    if (req.query.hasOwnProperty("file")) {
        console.log("attempting to load file...");
        res.sendfile("/srv/www/htdocs/clickpic/data/images/"+req.query.file);
    }
};

exports.manage = function (req, res) {
    if (req.query.hasOwnProperty("action")) {
        var action = req.query.hasOwnProperty("action");
        if (action === "upload") {
        }
        else if (action === "delete") {
        }
        else if (action === "save") {
            if (req.query.hasOwnProperty("img_data")) {
                var img_data = req.query.img_data;
            } else {
                throw {message: "No image data to save"};
            }
        }
    }
};
