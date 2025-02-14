require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors')
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dbConfig = require('./service/constant').dbConfig;
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// ====================
const mongoUri = `${dbConfig.host}`;
// mongoose.connect(mongoUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   dbName: dbConfig.dbName,
//   tls: true,
// });
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("open", () => {
  console.log(`connected to db ${dbConfig.dbName} =======>`);
});
mongoose.connection.on("error", (err) => {
  console.log("🚀 ~ mongoose.connection.on ~ err:", err)
  throw new Error(`unable to connect to database: ${dbConfig.dbName} =======>`);
});
// ====================



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
