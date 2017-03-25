var Users = require('../models/user');
var Roles = require('../models/role');
var config = require('../config/app');
exports.list = function (req, res) {
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
}
exports.set = function (req, res) {
    res.render('admin/users/new', {
        appName: config.name,
        layout: 'admin/layout/CMS',
    });
};
exports.new = function (req, res) {
    var _user = new Users({         
        email: req.body.email,
        password: req.body.password,
        firstname: req.body.first_name,
        lastname: req.body.last_name
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
exports.get = function (req, res) {
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
};
exports.update = function (req, res) {
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
};
exports.delete = function (req, res) {
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
};
exports.getRoles = function (req, res) {
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
};
exports.setRoles = function (req, res) {   
    Users.findById(req.params.id , function (error, user) {
        if (error)
            res.send(error);
        else {
            var _roles = [];            
            req.body.role.forEach(function (item) {                
                _roles.push(item);
            });            
            user.roles = _roles;
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
};