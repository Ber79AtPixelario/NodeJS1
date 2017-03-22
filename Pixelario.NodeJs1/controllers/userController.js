var Users = require('../models/user');
var config = require('../config/app');
exports.list = function (req, res) {
    Users.find({}).exec(function (err, users) {
        var _users = [];
        users.forEach(function (item) { 
            _users.push({ user: { email: item.email } });
        });
        console.log(_users);
        res.render('admin/users/list', {
            helpers: {
                appName: config.name,
                users: _users
            }, layout: false
        });
    });
}
exports.set = function (req, res) {
    res.render('admin/users/new', {
        layout: false       
    });
};
exports.new = function (req, res) {
    var _user = new Users({         
        email: req.body.email,
        password: req.body.password,
        role: 'init'
    });
    _user.save(function (error, documento) {
        if (error) {
            res.send(error);
        }
        else {
            res.redirect('/admin/users');
        }
    });
};