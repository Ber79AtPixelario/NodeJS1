'use strict'
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var router = express.Router();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));



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


// passport config
var passport = require('passport');
var expressSession = require('express-session');

// TODO - Why Do we need this key ?
app.use(expressSession({ secret: 'mySecretKey' }));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);
router.use(function (req, res, next) {    
    next();
});
var homeController = require('./controllers/admin/homeController.js');
var userController = require('./controllers/admin/userController.js')(passport);
var roleController = require('./controllers/admin/roleController.js');

//Rutas para login
app.get('/admin/', homeController.login);
app.post('/admin/login', passport.authenticate('local'), homeController.logon);

//Rutas para usuarios
//app.get('/admin/users/', userController.list);
//app.get('/admin/users/new', userController.set);
//app.post('/admin/users/new', userController.new);
//app.get('/admin/users/edit/:id', userController.get);
//app.post('/admin/users/edit/:id', userController.update);
//app.post('/admin/users/delete/', userController.delete);
//app.get('/admin/users/roles/:id', userController.getRoles);
//app.post('/admin/users/roles/:id', userController.setRoles);
app.use(userController);
//Rutas para roles
app.get('/admin/roles/', roleController.list);
app.get('/admin/roles/new', roleController.set);
app.post('/admin/roles/new', roleController.new);
app.get('/admin/roles/edit/:id', roleController.get);
app.post('/admin/roles/edit/:id', roleController.update);
app.post('/admin/roles/delete/', roleController.delete);


app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));
app.listen(3001, function () {
    console.log(__dirname + '/');
    console.log('API REST corriendo en http://localhost:3001');
});