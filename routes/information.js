var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


router.get('/about', function(req, res, next){
  res.render('information/about');
});


router.get('/contactus', function(req, res, next){
  res.render('information/contactus');
});


module.exports = router;
