exports.setLanguage = function (language) {
    var new_language_control = require('./'+language+'/main');
    global.ui_strings = new_language_control.ui_strings;
};
