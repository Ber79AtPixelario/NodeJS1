'use strict'
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var router = express.Router();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




//express-handlebars es el motor de template
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main', 
    helpers: {
        json: function (context) { return JSON.stringify(context); }
    }
}));

app.set('view engine', 'handlebars');

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
    console.log("/" + req.method);
    next();
});
router.get("/", function (req, res) {
    console.log(config.name);
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

app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));
app.listen(3000, function () {
    console.log(__dirname + '/');
    console.log('API REST corriendo en http://localhost:3000');
});