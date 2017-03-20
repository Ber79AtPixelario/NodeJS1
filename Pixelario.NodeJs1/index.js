'use strict'
const express = require('express');
const app = express();
var router = express.Router();

//express-handlebars es el motor de template
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

var config = require('./config/app');

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
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));
app.listen(3000, function () {
    console.log(__dirname + '/');
    console.log('API REST corriendo en http://localhost:3000');
});