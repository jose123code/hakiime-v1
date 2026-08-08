var express = require('express');
var router = express.Router();
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

// /* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'HOME'});
});

// router.get("/", express.static(path.dirname(__dirname) + "/"));


module.exports = router;
