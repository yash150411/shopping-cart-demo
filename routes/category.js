var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var Cart = require('../models/cart');
var User = require('../models/user');

var Product = require('../models/product');
var Order = require('../models/order');

var csrfProtection = csrf();

router.get('/notes', function(req, res, next) {
  Product.find({ category: "notes" }, function(err, docs) {
    if (err) {
      return res.write('Error!');
    }
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('category/notes', {products: productChunks});
  });
});


router.get('/coins', function(req, res, next) {
  Product.find({ category: "coins" }, function(err, docs) {
    if (err) {
      return res.write('Error!');
    }
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('category/coins', {products: productChunks});
  });
});


router.get('/errornotes', function(req, res, next) {
  Product.find({ category: "errornotes" }, function(err, docs) {
    if (err) {
      return res.write('Error!');
    }
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('category/errornotes', {products: productChunks});
  });
});

router.get('/errorcoins', function(req, res, next) {
  Product.find({ category: "errorcoins" }, function(err, docs) {
    if (err) {
      return res.write('Error!');
    }
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('category/errorcoins', {products: productChunks});
  });
});


router.get('/birthdaynotes', function(req, res, next){
  res.render('category/birthdaynotes');
});


module.exports = router;
