var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

const session = require('express-session');
const redisConnect = require('connect-redis')
const { redisClient } = require('./db/redis.js')
const fs = require('fs')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// const ENV = process.env.NODE_ENV
// if(ENV ==="dev"){
//     app.use(logger('dev', {
//         stream: process.stdout,
//     }));
// }else{
    let fileName = path.join(__dirname, "logs", "access.log")
    let writeStream = fs.createWriteStream(fileName, {
        flags: "a"
    })
    app.use(logger('combined', {
        stream: writeStream,
    }));
// }

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const RedisStore = redisConnect(session)
const sessionStore = new RedisStore({
    client: redisClient
})

app.use(session({
    secret: "mk_node", // 密匙
    cookie: {
        path: "/", // 默认，可以不写
        httpOnly: true, // 默认，可以不写
        maxAge: 24*60*60*1000 // 类似expires
    },
    store: sessionStore
}))

app.use('/', indexRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
