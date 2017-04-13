var util = require('util');
var Users = require('../../models/user');
var Roles = require('../../models/role');
var config = require('../../config/app');
var express = require('express');
var bCrypt = require('bcrypt-nodejs');
var router = express.Router();

module.exports = function (passport) {
    
    var isAuthenticated = function (req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/admin/');
    }
    var isSuperAdmin = function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.roles.indexOf("super administrador") > -1) {
                return next();
            }
        }
        res.redirect('/admin/');
    }
    //list of users
    router.get('/admin/users/', isSuperAdmin, function(req, res,next) {
        Users.find({}).exec(function (err, users) {
            var _users = [];
            users.forEach(function (item) {
                _users.push({
                    user: {
                        id: item._id, 
                        username: item.username,
                        email: item.email
                    }
                });
            });
            res.render('admin/users/list', {
                users: _users,
                userAuthenticated: req.user,
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
                layout: 'admin/layout/MetroUI',
            });
        });
    });
    router.get('/admin/users/new', isSuperAdmin, function (req, res) {
        res.render('admin/users/new', {
            userAuthenticated: req.user,
            appName: config.name,
            layout: 'admin/layout/CMS',
        });
    });
    router.post('/admin/users/new', isSuperAdmin,  passport.authenticate('signup', {
        successRedirect: '/admin/users',
        failureRedirect: '/admin/users/new',
        failureFlash : true
    }));
    router.get('/admin/users/edit/:id', isSuperAdmin,  function (req, res) {
        Users.findOne({ _id: req.params.id }).exec(function (err, user) {
            var _user = {
                id: user._id,
                userAuthenticated: req.user,
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
    router.post('/admin/users/edit/:id', isSuperAdmin,  function (req, res) {
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
    router.post('/admin/users/delete/', isSuperAdmin, function (req, res) {
        Users.findById(req.body.id, function (error, user) {
            if (error)
                res.send(error);
            else {
                
                if (user.roles.indexOf("super administrador") > -1) {
                    console.log("err");
                    res.send("No se puede elimar el usuario");
                } 
                else {
                    user.remove(function (error) {
                        if (error)
                            res.send(error);
                        else
                            res.redirect('/admin/users');
                    }
                    );
                }
            }
        });
    });
    router.get('/admin/users/roles/:id', isSuperAdmin, function (req, res) {
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
                            userAuthenticated: req.user,
                            appName: config.name,            
                            layout: 'admin/layout/account'
                        });
                    }
                });
            }
        });
    });
    router.post('/admin/users/roles/:id', isSuperAdmin,  function (req, res) {
        Users.findById(req.params.id , function (error, user) {
            if (error)
                res.send(error);
            else {                
                user.roles = updateRoles(req.body.role);
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
    
    router.get('/admin/users/password/:id', isSuperAdmin, function (req, res) {
        Users.findOne({ _id: req.params.id }).exec(function (err, user) {
            var _user = {
                id: user._id,                
                username: user.username
            };
            res.render('admin/users/changePassword', {
                user: _user,
                userAuthenticated: req.user,
                appName: config.name,
                layout: 'admin/layout/CMS',
            });
        });
    });
    router.post('/admin/users/password/:id', isSuperAdmin, function (req, res) {
        Users.findById(req.params.id, function (err, user) {
            if (req.body.newPassword.trim() && req.body.confirmPassword.trim()) {
                if (req.body.newPassword.trim() == req.body.confirmPassword.trim()) {
                    user.password = createHash(req.body.newPassword);
                    user.save(function (error, documento) {
                        if (error) {
                            res.send(error);
                        }
                        else {
                            res.redirect('/admin/users');
                        }
                    });
                }
                else
                    res.send({ error: "Password no confirmado" });
            }
            else
                res.send({ error: "Password vacio" });

        });
    });

    var updateRoles = function (bodyRoles){
        var _roles = [];
        if (bodyRoles && bodyRoles.length > 0) {
            if (util.isArray(bodyRoles)) {
                bodyRoles.forEach(function (item) {
                    _roles.push(item);
                });
            }
            else {                
                bodyRoles.split(",").forEach(function (item) {
                    _roles.push(item);
                });
            }
        }
        return _roles;       
    };
    // Generates hash using bCrypt
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
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