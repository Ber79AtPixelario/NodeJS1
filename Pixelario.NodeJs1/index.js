'use strict'
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var router = express.Router();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var hbs = require('express-hbs');
app.engine('hbs', hbs.express4({    
    partialsDir: [        
        'views/admin/partials/'
    ]
}));


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

var config = require('./config/app');

var mongoose = require('mongoose');

var db = mongoose.connection;
mongoose.connect(config.connectionString, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + config.connectionString + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + config.connectionString);
    }
});
router.use(function (req, res, next) {    
    next();
});
router.get("/", function (req, res) {    
    res.render('admin/home/index',{
        helpers: {
            appName: config.name
        }, layout: false });
});
app.use("/admin", router);
var userController = require('./controllers/userController.js');

app.get('/admin/users/', userController.list);
app.get('/admin/users/new', userController.set);
app.post('/admin/users/new', userController.new);
app.get('/admin/users/edit/:id', userController.get);
app.post('/admin/users/edit/:id', userController.update);
app.post('/admin/users/delete/', userController.delete);

app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));
app.listen(3001, function () {
    console.log(__dirname + '/');
    console.log('API REST corriendo en http://localhost:3001');
});