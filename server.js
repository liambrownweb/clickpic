var express = require('express'),
    app = express(),
    config = require('./config.js'),
    language_control = require('./language/control'),
    http = require('http'),
    httpServer = http.createServer(app),
    path = require('path'),
    routes = require('./routes'),
    data = require('./routes/data'),
    images = require('./routes/images'),
    user = require('./routes/user'),
    viewer =  require('./routes/viewer'),
    admin = require('./routes/admin');

language_control.setLanguage(config.locale.language);

var main = function () {
    // all environments
    app.configure(function () {
        app.set('port', process.env.PORT || 3000);
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(app.router);
        app.use(require('stylus').middleware(path.join(__dirname, 'public')));
        app.use(express.static(path.join(__dirname, 'public')));
    });

    // development only
    if ('development' === app.get('env')) {
      app.use(express.errorHandler());
    }

    httpServer.listen(app.get('port'), function () {
        console.log("Express server listening on port %s.", httpServer.address().port);
    });

    app.get('/', routes.index);
    app.get('/users', user.list);
    app.get('/images/get', images.main);
    app.get('/images/manage', images.manage);
    app.get('/data/get', data.main);
    app.get('/data/manage', data.manage);
    app.get('/viewer', viewer.main);
    app.get('/admin', admin.main);
}

main();

exports.main = main;
exports.whoAreYou = function () {
    return true;
};
