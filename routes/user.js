var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var Order = require('../models/order');
var Cart = require('../models/cart');
var User = require('../models/user');
var Product = require('../models/product');

var csrfProtection = csrf();

router.post('/removeUser', function(req, res, next) {
  User.findOneAndRemove({email: req.user.email}, function(err, success) {
    if(err) {
      console.log(err.message);
      req.flash('error', 'Failed to remove user!');
    }
    if(success) {
      req.flash('success', 'User removed successfully!');
      res.redirect('/');
    }
  });
});

router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {
  Order.find({  user: req.user  }, function(err, orders) {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    var messages = req.flash('success');
    res.render('user/profile', {csrfToken: req.csrfToken(),messages: messages, orders: orders,user: req.user});
  });
});




router.get('/myorders', isLoggedIn, function(req, res, next) {

  Order.find({  user: req.user  }, function(err, orders) {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    var messages = req.flash('success');
    res.render('user/myorders', {csrfToken: req.csrfToken(),messages: messages, orders: orders,user: req.user});
  });
});



router.get('/myproducts', isLoggedIn, function(req, res, next) {
  Product.find({  user: req.user  }, function(err, docs) {
    if (err) {
      return res.write('Error!');
    }
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    var message=req.flash('success');
    res.render('user/myproducts', {products: productChunks,message:message, user:req.user});
  });
});


router.get('/deleteproduct/:id', isLoggedIn, function(req, res, next){
  var deleteId = req.params.id;
  Product.findByIdAndRemove(deleteId, function (err, result){
    if (err){
      return res.write("error");
    }
    req.flash('success', "product deleted");
    res.redirect('/user/myproducts');  
  })
  });


router.post('/profile', function(req, res, next) {
    if (req.body.email) {  User.findOne({  email: req.body.email  },
      function(err, doc) {
      if (err) {
        req.flash('error', 'failed')
        console.log(err);
      }

      doc.email = req.body.email;
      doc.name = req.body.name;
      doc.state = req.body.state;
      doc.city = req.body.city;

      doc.save();
    });
  } else {
    console.log("invalid email");
  }
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
  res.end();
});

router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true,
  successFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    var firstname = req.body.firstname;
    req.flash('success', 'thankyou you ' + firstname + ' for signing up');
    res.redirect('/user/profile');
  }
});

router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(),messages: messages,hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});


//-------------------------

router.get('/sell', isLoggedIn, function (req, res, next) {
  var messages = req.flash('success');
  res.render("user/sell", {csrfToken: req.csrfToken(), messages: messages,});
});

router.post('/sell', function (req, res, next) {
 // const poduct = {
  //  name: req.body.name,
   // price: req.body.price
  //};
  const poduct = new Product({
    //_id: new mongoose.Types.ObjectId(),
    user: req.user,
    productname: req.body.productname,
    category: req.body.category,
    description: req.body.description,
    price: req.body.price
  });
  poduct.save()
  .then(function (){
   req.flash ('success', 'Thankyou your product has been added to sell we wiil inform you as we have a buyer for it')
   res.redirect('/user/myproducts');
 })
  .catch(err => console.log(err));
});






router.use('/', notLoggedIn, function(req, res, next) {
  next();
});



module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
