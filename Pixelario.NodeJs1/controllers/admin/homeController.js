var Users = require('../../models/user');

var config = require('../../config/app');
exports.login = function (req, res) {
    res.render('admin/home/index', {
        appName: config.name, 
        layout: false
    });
};
exports.logon = function (req, res) {
    res.redirect('/admin/users');
};