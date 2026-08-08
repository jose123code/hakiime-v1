var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// const bodyParser = require("body-parser");
var sassMiddleware = require("node-sass-middleware");
const {Logger} = require("./logger");

const cors = require("cors");
const passport = require("passport");

var Router = require("./routes/index");

const app = express();
const { eventManager } = require("../loaders/event");



async function runApp() {
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "hbs");

  app.use(cors());

  // app.use(sessionMiddleware);
  // app.use(bodyParser.json());
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(passport.initialize());

  app.use(
    sassMiddleware({
      src: path.join(__dirname, "public"),
      dest: path.join(__dirname, "public"),
      indentedSyntax: true, // true = .sass and false = .scss
      sourceMap: true,
    })
  );
  app.use(express.static(path.join(__dirname, "public")));

  app.use("/", (req, res, next)=>{
    next();
  });

  app.use("/", Router.main);
  
  app.use("/api/v1/", Router.api.v1);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // API error handling middleware
  app.use("/api", (err, req, res, next) => {
    Logger.error(`API Error for /api/*: ${err.message}`);

    // Check if the error is a known type (e.g., validation error)
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    // Handle other types of errors for API routes
    res.status(500).json({ error: "Internal Server Error for API" });
  });

  // error handler
  app.use(function (err, req, res, next) {
    eventManager.setSharedContext(req, res, err);
    // set locals, only providing error in development
    Logger.error("Web Error:", err.stack);

    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
}

module.exports = {
  app,
  runApp
};
