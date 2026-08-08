var express = require('express');
var router = express.Router();
var apiRouter = require('./api/index');
const { cacheAddMultiple } = require('../../loaders/cache');


// /* GET home page. */
router.get('/', function(req, res, next) {
  cacheAddMultiple({test3:"9023892",hello3:'hhh289'},'users').then(rest=>{
    console.log(rest);
    res.render('home', { title: 'HOME'});

  }).catch(errs=>{
    res.render('home', { title: 'HOME'});
  });

  
});

// router.get("/", express.static(path.dirname(__dirname) + "/")); 


module.exports = {
  main : router,
  api:apiRouter
}
