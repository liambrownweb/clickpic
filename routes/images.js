/*
 * GETs something from the images directory.
 */

var current_image = null,
    model = false,
    fs = require("fs"),
    my = {
        validateImage: function (image) {
            return true;
        },
        moveImage: function (image, res) {
            var source = fs.createReadStream(image.path),
                dest = fs.createWriteStream("/home/lima/NetBeansProjects/clickpic/" + "public/data/images/" + "house2/" + image.originalFilename);
            source.pipe(dest);
            source.on('end', function () { /* copied */
                fs.unlink(image.path);
                res.send({status: 0, message: "Upload complete, file copied"});
            });
            source.on('error', function (err) { /* error */
                res.send({status: 1, message: "File did not copy correctly after upload"});
            });
        },
        recordEntry: function (data) {
            if (model) {
                model.save(data);
            }
        }
    };

exports.main = function (req, res) {
    if (req.query.hasOwnProperty("file")) {
        console.log("attempting to load file...");
        res.sendfile("/srv/www/htdocs/clickpic/data/images/" + req.query.file);
    }
};

exports.manage = function (req, res) {
    if (req.body.hasOwnProperty("action")) {
        var action = req.body.action,
            files = req.files,
            current_index,
            current_file;
        if (action === "upload") {
            for (current_index in files) {
                if (files.hasOwnProperty(current_index)) {
                    current_file = files[current_index];
                    if (!my.validateImage(current_file.file)) {
                        continue;
                    }
                    //copy the file to the images directory.
                    my.moveImage(current_file, res);
                    //create a DB entry.
                    my.recordEntry(current_file);
                }
            }
        }
        else if (action === "delete") {
        }
        else if (action === "save") {
            if (req.query.hasOwnProperty("img_data")) {
                var img_data = req.query.img_data;
                res.send("We got an image!");
            } else {
                res.send("We got no image!");
                throw {message: "No image data to save"};
            }
        }
    } else {
        res.send("No action specified.");
    }
};

this.setModel = function (model) {
    this.model = model;
};
