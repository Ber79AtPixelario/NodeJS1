var Roles = require('../../models/role');
var config = require('../../config/app');
exports.list = function (req, res) {
    Roles.find({}).exec(function (err, roles) {
        var _roles = [];
        roles.forEach(function (item) { 
            _roles.push({ role: { id: item._id, name: item.name } });
        });
        res.render('admin/roles/list', {
            roles: _roles,
            appName: config.name,            
            layout: 'admin/layout/account',
        });
    });
}
exports.set = function (req, res) {
    res.render('admin/roles/new', {
        appName: config.name,
        layout: 'admin/layout/account',
    });
};
exports.new = function (req, res) {
    var _role = new Roles({         
        name: req.body.name,        
    });
    _role.save(function (error, documento) {
        if (error) {
            res.send(error);
        }
        else {
            res.redirect('/admin/roles/');
        }
    });
};
exports.get = function (req, res) {
    Roles.findOne({ _id: req.params.id }).exec(function (err, role) {
        var _role = {
            id: role._id,
            name: role.name,
        };
        res.render('admin/roles/edit', {
            role: _role,
            appName: config.name,
            layout: 'admin/layout/account',
        });
    });
};
exports.update = function (req, res) {
    Roles.findById(req.params.id, function (err, role) {
        role.name = req.body.name;        
        role.save(function (error, documento) {
            if (error) {
                res.send(error);
            }
            else {
                res.redirect('/admin/roles');
            }
        });
    });
};
exports.delete = function (req, res) {
    Roles.findById(req.body.id, function (error, role) { 
        if (error)
            res.send(error);
        else {
            role.remove(function (error) { 
                if (error)
                    res.send(error);
                else
                    res.redirect('/admin/roles');
            });
        }
    });    
};
