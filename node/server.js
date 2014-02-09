var my = {connected: false};
my.express = require('express');
my.app = my.express();
my.config = require('./config.js');
my.language_control = require('./language/control');
my.httpServer = require('http').createServer(my.app);
my.path = require('path');
my.routes = require('./routes');
my.data = require('./routes/data');
my.images = require('./routes/images');
my.user = require('./routes/user');
my.viewer =  require('./routes/viewer');
my.admin = require('./routes/admin');
my.initialize = function () {
    my.httpServer.on('close', function(){
        my.connected = false;
    });
    /**
     * Now initialize some things
     */
    my.data.connect(my.config.database.server);
    my.language_control.setLanguage(my.config.locale.language);
    // all environments
    my.app.configure(function () {
        my.app.set('port', process.env.PORT || 3000);
        my.app.set('views', my.path.join(__dirname, 'views'));
        my.app.set('view engine', 'ejs');
        my.app.use(my.express.favicon());
        my.app.use(my.express.logger('dev'));
        my.app.use(my.express.json());
        my.app.use(my.express.urlencoded());
        my.app.use(my.express.methodOverride());
        my.app.use(my.express.cookieParser('your secret here'));
        my.app.use(my.express.session());
        my.app.use(my.app.router);
        my.app.use(require('stylus').middleware(my.path.join(__dirname, 'public')));
        my.app.use(my.express.static(my.path.join(__dirname, 'public')));
    });
};

my.setServerPaths = function () {
    my.app.get('/', my.routes.index);
    my.app.get('/users', my.user.list);
    my.app.get('/images/get', my.images.main);
    my.app.get('/images/manage', my.images.manage);
    my.app.get('/data/get/:project', my.data.main);
    my.app.get('/data/manage/:project', my.data.manage);
    my.app.get('/viewer/:project', my.viewer.main);
    my.app.get('/admin', my.admin.main);

    // development only
    if ('development' === my.app.get('env')) {
      my.app.use(my.express.errorHandler());
    }
};

exports.getConnectionStatus = function () {
    if (my.connected) {
        return { 'status' : 'Listening',
            'port' : my.httpServer.address().port};
    } else {
        return { 'status' : 'Not listening',
            'port' : null};
    }
};

exports.setup = function () {
    my.initialize();
    my.setServerPaths();
};

exports.startListening = function () {
    my.httpServer.listen(my.app.get('port'), function () {
        var address = my.httpServer.address();
        if (address && address.port > 0) {
            my.connected = true;
            console.log("Express server listening on port %s.", my.httpServer.address().port);
        }
    });
};

exports.stopListening = function () {
    if (my.connected) {
        my.httpServer.close();
    }
};

exports.whoAreYou = function () {
    return true;
};
