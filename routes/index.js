/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'ClickPic: a point-and-click photo tour builder' });
};
