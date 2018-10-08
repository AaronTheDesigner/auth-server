const jwt = require('jwt-simple');
const User = require('../models/user')
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, lat: timestamp }, config.secret);
};

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(422).send({ error: 'Please provide email and password'});
  }
  // find user with given email
  User.findOne({ email: email }, function(err, existingUser) {
      // if user does exist, return error
    if (err) { return next(err); }
    // if a user with email does not exist, create and save user record
    if(existingUser) {
      return res.status(422).send({ error: 'Email is in use.' });
    };
    // respond to request indicating the user was created
    const user = new User({
      email: email,
      password: password
    })
    // save user to database
    user.save(function(err) {
      if (err) {return next(err);}
      // respond to request indicating user was created
      res.json({ token: tokenForUser(user) })
    });
  }); 
}