//allows access to the .env file. It is important to put all credentials in the .env file so that they are not published online
require("dotenv").config();
//handlebars- template engine for express. There are other options but in class we learn hbs
const hbs = require("hbs");
//express in a node framework.
const express      = require('express');
const path         = require('path');
//The small icon that appears in the browser tab
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');


//connecting to the database.
mongoose.connect('mongodb://localhost/awsome-project');

//the package.json is where all dependences are stored. when you clone a repo on github you need to do a 'npm install' to install them all locally. The npm install goes through the package.json so it knows what to install.
const app_name = require("./package.json").name;

const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

//node-sass-middleware recompiles the .scss `("sassy" css)` file for express based servers.
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



//all aditional routers need to be added otherwise it won't work
const index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
