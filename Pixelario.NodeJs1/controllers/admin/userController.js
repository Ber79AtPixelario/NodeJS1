var Users = require('../../models/user');
var Roles = require('../../models/role');
var config = require('../../config/app');
var express = require('express');
var router = express.Router();

module.exports = function (passport) {
    //list of users
    router.get('/admin/users/', function (req, res) {
        Users.find({}).exec(function (err, users) {
            var _users = [];
            users.forEach(function (item) {
                _users.push({ user: { id: item._id, email: item.email } });
            });
            res.render('admin/users/list', {
                users: _users,
                appName: config.name,
                helpers: {
                    block: function (name) {
                        var blocks = this._blocks;
                        content = blocks && blocks[name];
                        return content ? content.join('\n') : null;
                    },
                    contentFor: function (name, options) {
                        var blocks = this._blocks || (this._blocks = {});
                        block = blocks[name] || (blocks[name] = []); //Changed this to [] instead of {}
                        block.push(options.fn(this));
                    }
                }, 
                layout: 'admin/layout/CMS',
            });
        });
    });
    router.get('/admin/users/new', function (req, res) {
        res.render('admin/users/new', {
            appName: config.name,
            layout: 'admin/layout/CMS',
        });
    });
    router.post('/admin/users/new', passport.authenticate('signup', {
        successRedirect: '/admin/users',
        failureRedirect: '/admin/users/new',
        failureFlash : true
    }));
    //router.post('/admin/users/new', function (req, res) {
    //    var _user = new Users({
    //        email: req.body.email,
    //        password: req.body.password,
    //        firstname: req.body.first_name,
    //        lastname: req.body.last_name
    //    });
    //    _user.save(function (error, documento) {
    //        if (error) {
    //            res.send(error);
    //        }
    //        else {
    //            res.redirect('/admin/users');
    //        }
    //    });
    //});
    router.get('/admin/users/edit/:id', function (req, res) {
        Users.findOne({ _id: req.params.id }).exec(function (err, user) {
            var _user = {
                id: user._id,
                firstname: user.first_name,
                lastname: user.last_name
            };
            res.render('admin/users/edit', {
                user: _user,
                appName: config.name,
                layout: 'admin/layout/CMS',
            });
        });
    });
    router.post('/admin/users/edit/:id', function (req, res) {
        Users.findById(req.params.id, function (err, user) {
            user.first_name = req.body.firstname;
            user.last_name = req.body.lastname;
            user.save(function (error, documento) {
                if (error) {
                    res.send(error);
                }
                else {
                    res.redirect('/admin/users');
                }
            });
        });
    });
    router.post('/admin/users/delete/', function (req, res) {
        Users.findById(req.body.id, function (error, user) {
            if (error)
                res.send(error);
            else {
                user.remove(function (error) {
                    if (error)
                        res.send(error);
                    else
                        res.redirect('/admin/users');
                });
            }
        });
    });
    router.get('/admin/users/roles/:id', function (req, res) {
        Roles.find({}, function (error, roles) {
            if (error)
                res.send(error);
            else {
                Users.findById(req.params.id , function (error, user) {
                    if (error)
                        res.send(error);
                    else {
                        var _roles = [];
                        roles.forEach(function (item) {
                            var _userIs = false;
                            if (user.roles.indexOf(item.name) > -1)
                                _userIs = true;
                            _roles.push({ role: { id: item._id, name: item.name, userIs: _userIs } });
                        });
                        
                        var _user = {
                            id: user._id,
                            firstname: user.first_name,
                            lastname: user.last_name
                        };
                        res.render('admin/users/roles', {
                            roles: _roles,
                            user: _user,
                            appName: config.name,            
                            layout: 'admin/layout/account'
                        });
                    }
                });
            }
        });
    });
    router.post('/admin/users/roles/:id', function (req, res) {
        Users.findById(req.params.id , function (error, user) {
            if (error)
                res.send(error);
            else {
                var _roles = [];
                if (req.body.role && req.body.role.length > 0) {
                    req.body.role.forEach(function (item) {
                        _roles.push(item);
                    });
                }
                user.roles = _roles;
                console.log(user.roles);
                user.save(function (error, documento) {
                    if (error) {
                        res.send(error);
                    }
                    else {
                        res.redirect('/admin/users');
                    }
                });
            }
        });
    });
    var isAuthenticated = function (req, res, next) {
        // if user is authenticated in the session, call the next() to call the next request handler 
        // Passport adds this method to request object. A middleware is allowed to add properties to
        // request and response objects
        if (req.isAuthenticated())
            return next();
        // if the user is not authenticated then redirect him to the login page
        res.redirect('/');
    }
    return router
}