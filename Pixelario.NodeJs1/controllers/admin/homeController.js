var Users = require('../../models/user');
var express = require('express');
var router = express.Router();
var config = require('../../config/app');

module.exports = function (passport) {
    router.get('/admin/', function (req, res) {
        res.render('admin/home/index', {
            appName: config.name, 
            layout: false
        });
    }); 
    router.post('/admin/login/', passport.authenticate('login', {
        successRedirect: '/admin/users/',
        failureRedirect: '/admin/',
        failureFlash : true
    }));
    router.get('/admin/logoff/', function(req, res) {
        req.logout();
        res.redirect('/admin/');  
    });
    return router;   
};