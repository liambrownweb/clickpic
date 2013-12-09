/*
 * GETs something from the images directory.
 */

exports.main = function(req, res){
  res.render('images', {title: 'Image'});
};
