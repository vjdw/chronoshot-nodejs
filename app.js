var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/chronoshot');

var common = require('./common');

var app = express();

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

var routes = require('./routes/index');
var media = require('./routes/media');
var users = require('./routes/users');

console.log('chronoshot is up.');

// Ensure indexes exist.
var collection = db.get('chronoshot');
collection.index( {datetime: 1} );
collection.index( {filename: 1} );

// Monitor photo directory for changes.
var chokidar = require('chokidar');
//chokidar.watch('/home/vin/code/photos/', {ignored: /[\/\\]\./}).on('all', function(event, path) {
chokidar.watch('/media/data/photos/', {ignored: /[\/\\]\./, awaitWriteFinish: true})
        .on('add', function(path, event) {
            //console.log(path);
            common.EnqueueImageImport({filePath: path, db: db}, function (err) {
                if (err) throw err;
            });
        });

//routes.

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/media', media);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
