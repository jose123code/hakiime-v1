var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
var sassMiddleware = require('node-sass-middleware');
const session = require("express-session");
// let RedisStore = require("connect-redis")(session);
const fs = require("fs").promises;

const cors = require('cors');
const passport = require("passport");

// const {
//   client: redisClient,
//   exists,
//   set,
//   auth: runRedisAuth,
// } = require("./redis");

// const { createDemoData } = require("./data/demo-data");


var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var meRouter = require('./routes/me');
// var loginRouter = require('./routes/login');
// var registerRouter = require('./routes/register');
// var logoutRouter = require('./routes/logout');
// var roomRouter = require('./routes/room/index');
// var roomsRouter = require('./routes/rooms/index');
// var verifyRouter = require('./routes/verify');
// var randomnameRouter = require('./routes/randomname');
// var recoverRouter = require('./routes/recover');
// var resetRouter = require('./routes/reset');
// var resendRouter = require('./routes/resend');
// var postRouter = require('./routes/post');
// const auth = require('./middlewares/authRestrict');


const app = express();

// const sessionMiddleware = session({
//   store: new RedisStore({ client: redisClient }),
//   secret: "keyboard cat",
//   saveUninitialized: true,
//   resave: true,
// });

/** Initialize the app */
(async () => {
  /** Need to submit the password from the local stuff. */
  // await runRedisAuth();
  /** We store a counter for the total users and increment it on each register */
  // const totalUsersKeyExist = await exists("total_users");
  // if (!totalUsersKeyExist) {
  //   /** This counter is used for the id */
  //   await set("total_users", 0);
  //   /**
  //    * Some rooms have pre-defined names. When the clients attempts to fetch a room, an additional lookup
  //    * is handled to resolve the name.
  //    * Rooms with private messages don't have a name
  //    */
  //   await set(`room:${0}:name`, "General");

  //   /** Create demo data with the default users */
  //   await createDemoData();
  // }

  /** Once the app is initialized, run the server */
  runApp();
})();

async function runApp(){
  // const repoLinks = await fs
  //   .readFile("./repo.json")
  //   .then((x) => JSON.parse(x.toString()));

  // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors()); 

// app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//=== 3 - INITIALIZE PASSPORT MIDDLEWARE
app.use(passport.initialize());

// require("./middlewares/jwt")(passport);

// app.use(function(req, res, next){
//   var err = req.session.error;
//   var msg = req.session.success;
//   delete req.session.error;
//   delete req.session.success;
//   res.locals.message = '';
//   if (err) res.locals.message = err;
//   if (msg) res.locals.message = msg;
//   next();
// });




app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// app.get("/links", (req, res) => {
//   return res.send(repoLinks);
// });

app.use('/', indexRouter);
// app.use('/', auth, indexRouter);
// app.use('/users', usersRouter);
// app.use('/me',meRouter);
// app.use('/login',loginRouter);
// app.use('/register',registerRouter);
// app.use('/logout',logoutRouter);
// app.use('/randomname',randomnameRouter);
// app.use('/room',roomRouter);
// app.use('/rooms',roomsRouter);
// app.use('/resend',resendRouter);
// app.use('/verify',verifyRouter);
// app.use('/recover',recoverRouter);
// app.use('/reset',resetRouter);
// app.use('/post',postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
}


module.exports = {
  app,
  // sessionMiddleware
};
