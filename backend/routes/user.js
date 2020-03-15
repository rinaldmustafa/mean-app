const express = require("express");
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {  // yield us the hash, .then a promise gives us
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created successfully!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        })
    });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user) {
        return res.status(401).json({
          message: "Authantication failed!"
        });
      }
      fetchedUser = user;
      return bcrypt.compare( req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        res.status(401).json({
          message: "Auth denied!"
            });
        }
        const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
          "sercret_key_which_is_long_string",
          { expiresIn: "1h"} );  //this method creates a new token from input data
        res.status(200).json({
          token: token
        });
    })
    .catch(error => {
       res.status(401).json({
        message: "Auth denied!"
        });
    });
});


module.exports = router;
